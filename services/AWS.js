const AWS=require('aws-sdk');
require('dotenv').config();

function uploadtoS3(expenses,filename){
    const BUCKET_NAME=process.env.AWS_BUCKET_NAME;
    const IAM_USER_KEY=process.env.AWS_KEY_ID;
    const IAM_USER_SECRET=process.env.AWS_SECRET_KEY;
        let s3bucket=new AWS.S3({
                accessKeyId:IAM_USER_KEY,
                secretAccessKey:IAM_USER_SECRET,
                Bucket:BUCKET_NAME
        })
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:expenses,
            ACL:'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    resolve(s3response.Location);  
                }
            })
        });
        
    }
    module.exports={uploadtoS3};