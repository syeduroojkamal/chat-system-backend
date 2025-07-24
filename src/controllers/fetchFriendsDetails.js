import User from "../models/userModel.js";

export default async function fetchFriendsDetails(friendIdArr) {
  if (!friendIdArr) {
    return {
      success: true,
      message: "Empty friendsIdArray",
      data: [],
    };
  }
  try {
    const friends = await User.find({ userId: { $in: friendIdArr } });
    return {
      success: true,
      message: "Friends fetched successfully",
      data: friends,
    };
  } catch (err) {
    console.error("Error in fetchFriendsDetails:", err);
    return {
      success: false,
      message: "Server error in fetchFriendsDetails",
    };
  }
}
