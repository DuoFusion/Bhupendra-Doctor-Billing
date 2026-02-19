import { responseMessage, status_code } from "../../common";
import { Auth_Collection } from "../../model";
import { userValidaiton } from "../../validation";

//================ get all users controller==============
export const getAllUsers = async (req , res)=>{
    try {
        const users = await Auth_Collection.find({isDelete : false});

        res.status(status_code.SUCCESS).json({status : true , message : responseMessage.allUsersGet_success , users})
    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.allUsersGet_failed , error})
    }
}

// ============ Get Single User Controller ============
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Auth_Collection.findOne({
      _id: id,
      isDelete: false,
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      user,
    });

  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Failed to fetch user",
      error,
    });
  }
};


//============ Update User controller ===============
export const updateUser = async(req ,res)=>{

    const {error} = userValidaiton.validate(req.body)

    if (error) {
        return res.status(400).json({
        status: false,
        message: error.details[0].message,
        });
    }
    
    try {
        const {id} = req.params
        const {email , name , role} = req.body
        
        const result = await Auth_Collection.findByIdAndUpdate(id , {email , name , role} , {new : true})
        
        res.status(status_code.SUCCESS).json({status : true , message : responseMessage.userUpdate_success , result})
    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.userUpdate_failed , error})
    }
}


//============ Delete User controller ===============
export const deleteUser = async(req ,res)=>{
      try {
        const {id} = req.params
        
        const result = await Auth_Collection.findByIdAndUpdate(id , {isDelete : true} , {new : true})
        
        res.status(status_code.SUCCESS).json({status : true , message : responseMessage.userDeleted_success , result})
    } catch (error) {
        res.status(status_code.BAD_REQUEST).json({status : false , message : responseMessage.userDeleted_failed , error})
    }
}