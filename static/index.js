
const fileInput = document.querySelector("#files")
const dropzone = document.querySelector("#dropzone");

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

    uploadToS3(files[i], thumbnail);
  }
}

async function uploadToS3(file, preview) {
  
  const fileExtension = file.name.split(".")[1];
  // get secure url from our server
  const { url } = await fetch("/s3Url", { headers: {"fileExtension": fileExtension}}).then(res => res.json())

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