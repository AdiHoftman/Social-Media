import User from "../models/User.js";

// User //
export const getUser = async (req, res) => {
  try {
    const { id } = req.params; //grab the id
    const user = await User.findById(id); //grab the information of the user we need
    res.status(200).json(user); //send back to front everything relevant to this user after found it.
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//grab all the user friends related to the ID that specified.
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      //grab all the information from the friends Id.
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      //all the information
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends); //send to front
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update //
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id); //grab information user
    const friend = await User.findById(friendId); //grab information friend

    //if the friend ID is included in the main user's friend's
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId); //remove
      friend.friends = friend.friends.filter((id) => id !== id); //remove if the ids is equal
    } else {
      // if it's not equal, add the friend
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    //grab all the information from the friends Id.
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      //all the information
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
