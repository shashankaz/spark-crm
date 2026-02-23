import {
  fetchCommentsByLeadService,
  createCommentForLeadService,
} from "../services/comment.service.js";

export const getAllCommentsByLeadId = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { comments, totalCount } = await fetchCommentsByLeadService({
      leadId,
      cursor,
      limit,
      search,
    });

    res.json({
      success: true,
      message: "Comments retrieved successfully",
      data: { comments, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const createCommentForLead = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const newComment = await createCommentForLeadService({
      tenantId,
      leadId,
      userId,
      userName,
      comment,
    });
    if (!newComment) {
      return res.status(400).json({
        success: false,
        message: "Failed to create comment",
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: { comment: newComment },
    });
  } catch (error) {
    next(error);
  }
};
