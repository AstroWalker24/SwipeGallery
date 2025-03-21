import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;
const VIDEO_URL = process.env.VIDEO_URL;
const IMAGE_URL = process.env.PHOTO_URL;


app.use(cors());
app.use(express.json());


app.get('/media', async (req,res)=>{
    try{
        const [videoResponse, imageResponse] =await Promise.all([
            axios.get(VIDEO_URL, {
                headers: {
                    Authorization: API_KEY
                }
            }), 

            axios.get(IMAGE_URL, {
                headers:{
                    Authorization: API_KEY
                }
            })
        ])

        res.send({
            videos: videoResponse.data,
            images: imageResponse.data
        })
    }
    catch(error){
        console.log("Error fetching the videos ",error);
    }
})

app.listen(PORT , () =>{
    console.log(`Server is up and running on port ${PORT}`);
})