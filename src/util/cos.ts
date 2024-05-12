import COS from 'cos-js-sdk-v5';
function dataURLtoBlob(dataurl: any) {
  var arr = dataurl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const uploadFileOrPic = async (file: any, fileName: any, callBackUp: (arg0: { cos: any; taskId: any }) => any) => {
  return new Promise((resolve, reject) => {
    // const res = await credential({ bucketKey: 'gas_bucket' })
    const bucketName = 'ar-poster-1314867896';
    const region = 'ap-guangzhou';
    // const { tmpSecretId, tmpSecretKey, sessionToken, bucketName, region, expiredTime } = res.result
    let reader = new FileReader();
    reader.readAsDataURL(file.raw)
    reader.onload = () => {
      var body = dataURLtoBlob(reader.result)

      const cos = new COS({
        // 必选参数
        getAuthorization: (options: any, callback: any) => {
          const obj = {
            XCosSecurityToken: '-',
            // StartTime: data.startTime, // 开始时间戳，单位秒
            ExpiredTime: 9000000000 // 过期时间戳，单位秒
          }
          callback(obj)
        }
      })
      // 上传图片
      cos.uploadFile({
        Bucket: bucketName, /* yunxixiaoke-1306842204 */
        Region: region, /* ap-guangzhou */
        Key: fileName,
        StorageClass: 'STANDARD', // 上传类型，可选
        Body: body, // 上传文件对象
        onTaskReady: function (taskId: any) {
          // 用于中断分片上传回调
          callBackUp && callBackUp({ cos, taskId })
        },
        onProgress: function (progressData: any) {
          console.log(JSON.stringify(progressData));
        },
        onFileFinish: function (err: any, data: any, options: { Key: string }) {
          console.log(options.Key + '上传' + (err ? '失败' : '完成'));
          console.log(data);
          if (data) {
            resolve({
              status: 'success',
              response: {
                url: "https://"+data.Location
              }
            })
          } else {
            console.log(err)
            resolve({
              status: 'fail',
              error: '上传失败',
            });
          }
        },
      })

    }
  })

}
export const folders={image:'Image(test)/', file:'answer(test)/',video:'video(test)/'}
