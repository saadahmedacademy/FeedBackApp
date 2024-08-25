import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(request: Request ,{params} : { params: {messageid: string}}) {

  const messageId = params.messageid
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
   const updatedUser = await UserModel.updateOne(
      { _id: _user._id},
     { $pull : {messages : { _id : messageId}}},
     { new: true }
   );

   if(updatedUser.modifiedCount === 0) {
    return Response.json(
      { message: 'message not found or already deleted', success: false },
      { status: 404 }
    );
   }

   return Response.json(
    { message: 'message deleted successfully', success: true },
    { status: 200 }
     ); 
  } catch (error) {
    console.error('somthing went wrong while deleting message:', error);
    return Response.json(
      { message: 'somthing went wrong while deleting message', success: false },
      { status: 500 }
    );
  }
}
