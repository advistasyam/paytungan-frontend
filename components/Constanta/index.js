const getBackendUrl = () => {
  let hostname
  let beUrl
  if (typeof window !== "undefined") {
    hostname = window.location.hostname

    beUrl = "https://paytungan-backend-jxdyczvjvq-as.a.run.app"
  }
  return beUrl
}

const getImageStorageUrl = (uid, imageType) => {
  return `https://storage.googleapis.com/paytungan-static-file/${uid}.${imageType}`
}

const getUploadImageUrl = (uid, imageType) => {
  return `https://storage.googleapis.com/upload/storage/v1/b/paytungan-static-file/o?uploadType=media&name=${uid}.${imageType}`
}

export { getBackendUrl, getImageStorageUrl, getUploadImageUrl }
