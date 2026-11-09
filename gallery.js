(() => {
  const owner = "smmarwar";
  const repo = "smmarwar";
  const folder = "gallery/photos";
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;
  const gallery = document.getElementById("gallery");
  const status = document.getElementById("status");
  const empty = document.getElementById("empty");
  const allowed = /\.(jpe?g|png|webp|gif|avif)$/i;

  fetch(api, { headers: { Accept: "application/vnd.github+json" } })
    .then(response => {
      if (!response.ok) throw new Error("Could not read the photo folder");
      return response.json();
    })
    .then(files => {
      const photos = files
        .filter(file => file.type === "file" && allowed.test(file.name))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      status.textContent = photos.length ? photos.length + " photo(s)" : "";
      empty.hidden = photos.length > 0;
      photos.forEach(file => {
        const figure = document.createElement("figure");
        figure.className = "photo";
        const img = document.createElement("img");
        img.src = file.download_url;
        img.alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        img.loading = "lazy";
        img.decoding = "async";
        const caption = document.createElement("figcaption");
        caption.textContent = img.alt;
        figure.append(img, caption);
        gallery.append(figure);
      });
    })
    .catch(() => {
      status.textContent = "Photos could not be loaded right now. Please check your internet connection and try again.";
      empty.hidden = false;
    });
})();