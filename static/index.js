
const fileInput = document.querySelector("#files")
const dropzone = document.querySelector("#dropzone")
const albumID = uuidv4()
const urlParams = new URLSearchParams(window.location.search);

fileInput.addEventListener("change", processImagesForUpload, false);

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("drop-zone--over");
});

["dragleave", "dragend"].forEach((type) => {
  dropzone.addEventListener(type, (e) => {
    e.preventDefault();
    dropzone.classList.remove("drop-zone--over");
  });
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("drop-zone--over");
  processImagesForUpload(e);
});

function processImagesForUpload(e) {
  const files = e.target.files || e.dataTransfer.files;
  const output = document.querySelector("output");
  for (let i = 0; i < files.length; i++) {
    if (!files[i].type.match("image")) continue;
    const thumbnail = document.createElement("div");
    thumbnail.innerHTML = `<div class='upload__img-box'><div class='loading'></div></div>`;
    output.appendChild(thumbnail);

    uploadToS3(files[i], thumbnail, albumID);
  }
}

async function uploadToS3(file, preview, albumID) {
  const itemID = urlParams.get('id');
  const fileExtension = file.name.split(".")[1];
  // get secure url from our server
  const { url } = await fetch("/s3Url/"+itemID+"/"+albumID, { headers: {"File-Extension": fileExtension, "Content-Type": file.type}}).then(res => res.json())

  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  })

  const imageUrl = url.split('?')[0];

  // post requst to my server to store any extra data


  preview.innerHTML = `
    <div class='upload__img-box'>
      <div style='background-image: url("${imageUrl}")' class='img-bg'></div>
    </div>`;
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}