import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectTodb } from "@/utils/connectToDb";

import User from '@/models/user';


const handler = NextAuth ({
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks : {
        async signIn ( {profile}) {
            try {
                await connectTodb() ;                
                const userExists =await User.findOne (
                    {
                        email : profile.email
                    }   
                );

                if (!userExists) {
                    await User.create (
                        {
                            email : profile.email,
                            username : profile.name.replace(" ", "").toLowerCase(),
                            image : profile.picture
                        }
                    )
                } 

                return  true;
            } catch (error) {
                console.log(error);
                return false
            }
        },

        async session ({session}){ // authenticated user details

            const sessionUser = await User.findOne({
                email : session.user.email
            })
            session.user.id = sessionUser._id.toString();
            return session 
            

        }
    } 
})


export {handler as GET , handler as POST}

