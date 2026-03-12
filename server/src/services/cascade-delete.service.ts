import mongoose, { Types } from "mongoose";
import { Lead } from "../modules/lead/models/lead.model";
import { Call } from "../modules/call/models/call.model";
import { Comment } from "../modules/comment/models/comment.model";
import { Attachment } from "../modules/attachment/models/attachment.model";
import { Email } from "../modules/lead-email/models/email.model";
import { LeadActionHistory } from "../models/lead-action-history.model";
import { Deal } from "../modules/deal/models/deal.model";
import { Group } from "../modules/group/models/group.model";
import { User } from "../modules/user/models/user.model";
import { Session } from "../modules/auth/models/session.model";

export const deleteLeadWithCascade = async ({
  leadId,
}: {
  leadId: Types.ObjectId;
}) => {
  const dbSession = await mongoose.startSession();

  try {
    await dbSession.startTransaction();

    const lead = await Lead.findById(leadId).session(dbSession);

    if (!lead) {
      throw new Error("Lead not found");
    }

    await Promise.all([
      Lead.collection.deleteOne({ _id: lead._id }, { session: dbSession }),
      Call.deleteMany({ leadId: lead._id }, { session: dbSession }),
      Comment.deleteMany({ leadId: lead._id }, { session: dbSession }),
      Attachment.deleteMany({ leadId: lead._id }, { session: dbSession }),
      Email.deleteMany({ leadId: lead._id }, { session: dbSession }),
      LeadActionHistory.deleteMany(
        { leadId: lead._id },
        { session: dbSession },
      ),
      Deal.deleteMany({ leadId: lead._id }, { session: dbSession }),
      Group.updateMany(
        { leads: lead._id },
        { $pull: { leads: lead._id } },
        { session: dbSession },
      ),
    ]);

    await dbSession.commitTransaction();

    return { success: true };
  } catch (error) {
    await dbSession.abortTransaction();
    throw error;
  } finally {
    dbSession.endSession();
  }
};

export const deleteUserWithCascade = async ({
  userId,
}: {
  userId: Types.ObjectId;
}) => {
  const dbSession = await mongoose.startSession();

  try {
    await dbSession.startTransaction();

    const user = await User.findById(userId).session(dbSession);

    if (!user) {
      throw new Error("User not found");
    }

    await Promise.all([
      User.collection.deleteOne({ _id: user._id }, { session: dbSession }),
      Session.deleteMany({ userId }, { session: dbSession }),
    ]);

    await dbSession.commitTransaction();

    return { success: true };
  } catch (error) {
    await dbSession.abortTransaction();
    throw error;
  } finally {
    dbSession.endSession();
  }
};
