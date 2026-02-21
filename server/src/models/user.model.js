import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: "version",
  },
);

userSchema.index({ tenantId: 1 });

userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase();
  next();
});

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//   }

//   next();
// }); // Works only when use doc.save() or doc.create() but not with findOneAndUpdate() or updateOne()

// userSchema.pre("findOneAndUpdate", async function () {
//   const update = this.getUpdate();

//   if (update.password) {
//     const salt = await bcrypt.genSalt(10);
//     update.password = await bcrypt.hash(update.password, salt);
//   }
// });

// userSchema.post("save", function (next) {
//   // Send welcome email

//   next();
// });

// userSchema.pre("findOne", function () {
//   this.populate("tenantId", "name");
// });

export const User = model("User", userSchema);
