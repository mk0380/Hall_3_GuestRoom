import User from "@/models/User";
import connectDB from "@/utils/connectDB"

const deleteAll =  async (req,res)=>{

    await connectDB();

    await User.deleteMany({})

    return res.status(200).json({
        message:"Deleteda all"
    })

}

export default deleteAll