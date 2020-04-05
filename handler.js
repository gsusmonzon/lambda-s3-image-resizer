'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

//external dependency!!!
const sharp = require('sharp');
const stream = require('stream');

const THUMBNAIL_SIZE = Number.parseInt(process.env.THUMBNAIL_SIZE || 300);

module.exports.s3_thumbnail_generator = async (event, context) => {
  // console.log('INPUT\n', JSON.stringify(event));
  const baseUrl = '???';
  // Get the S3 Bucket S3 key from event
  const s3Event = event.Records[0].s3;
  const bucket = s3Event.bucket.name;
  const srcKey = decodeFileName(s3Event.object.key);

  // TODO:  Note that we may be triggering a new execution when we 'create' the destination file.
  //        this should optimized, I guess from the serverless.yml events
  // only create a thumbnail on non thumbnail pictures.
  if (srcKey.includes('.thumbnail.')) {
    return buildResponse(baseUrl, bucket, srcKey);
  }

  const dstKey = findDestinationName(srcKey);
  await resizePng({ bucket, srcKey, dstKey, size: THUMBNAIL_SIZE });

  return buildResponse(baseUrl, bucket, dstKey);
};

///////////////////////// Response

const buildResponse = (baseUrl, bucket, imageKey) => {
  const fullPath = `${baseUrl}/${bucket}/${imageKey}`;
  return {
    statusCode: 200,
    headers: { location: fullPath },
    body: JSON.stringify(
      {
        url: fullPath,
      },
      null,
      2
    ),
  };
};

///////////////////////// Impl

const decodeFileName = (encodedFilename) => {
  //Note that the object keyname value is URL encoded. For example "red flower.jpg" becomes "red+flower.jpg".
  // src: http://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
  return decodeURIComponent(encodedFilename.replace(/\+/g, ' '));
};

const findDestinationName = (name) => {
  const components = name.split('.');
  if (components.length > 1) {
    components.splice(components.length - 1, 0, 'thumbnail');
  } else {
    components.push('thumbnail');
  }
  return components.join('.');
};

// const fakeResize = async (options) => {
//   const { bucket, srcKey, dstKey } = options;
//   return S3.copyObject({
//     Bucket: bucket, //dst bucket
//     Key: dstKey,
//     CopySource: encodeURIComponent(bucket + '/' + srcKey),
//     MetadataDirective: 'COPY',
//   }).promise();
// };

const resizePng = async (options) => {
  const { bucket, srcKey, dstKey, size } = options;
  const streamResize = sharp()
    .resize({ width: size, height: size, fit: sharp.fit.inside, withoutEnlargement: true })
    .toFormat('png');
  const readStream = S3.getObject({ Bucket: bucket, Key: srcKey }).createReadStream();
  const writeStream = new stream.PassThrough();
  const uploadProgress = S3.upload({
    ContentType: 'image/png',
    Body: writeStream,
    Bucket: bucket,
    Key: dstKey,
  }).promise();
  //data streaming
  readStream.pipe(streamResize).pipe(writeStream);
  await uploadProgress;
  return dstKey;
};
