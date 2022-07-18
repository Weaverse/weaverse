const loadScript = function (url: string) {
  return new Promise(function (resolve) {
    const script = document.createElement("script");
    script.src = url;

    script.addEventListener("load", function () {
      // The script is loaded completely
      resolve(true);
    });

    document.head.appendChild(script);
  });
};
