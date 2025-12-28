const PDF_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDF_JS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let pdfJsPromise;

function configurePdfWorker(pdfLib) {
  if (pdfLib?.GlobalWorkerOptions && !pdfLib.GlobalWorkerOptions.workerSrc) {
    pdfLib.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER;
  }
}

/**
 * Carga PDF.js (si no está ya presente) y configura el worker.
 * Devuelve una promesa que resuelve con `pdfjsLib`.
 */
function loadPdfJs() {
  if (pdfJsPromise) return pdfJsPromise;

  pdfJsPromise = new Promise((resolve, reject) => {
    if (window.pdfjsLib) {
      configurePdfWorker(window.pdfjsLib);
      resolve(window.pdfjsLib);
      return;
    }

    const script = document.createElement("script");
    script.src = PDF_JS_CDN;
    script.async = true;
    script.onload = () => {
      if (!window.pdfjsLib) {
        reject(new Error("PDF.js se cargó pero no expuso pdfjsLib."));
        return;
      }
      configurePdfWorker(window.pdfjsLib);
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("No se pudo cargar PDF.js desde el CDN."));
    document.head.appendChild(script);
  });

  return pdfJsPromise;
}

window.loadPdfJs = loadPdfJs;