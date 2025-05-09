import PDFParser from "pdf2json";

const extractPdfText = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const pages = pdfData?.Pages || []; // updated structure
        const text = pages
          .map((page) =>
            page.Texts.map((textItem) =>
              decodeURIComponent(textItem.R.map((r) => r.T).join(""))
            ).join(" ")
          )
          .join("\n");

        resolve(text);
      } catch (err) {
        reject("Failed to parse PDF text: " + err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
};

export default extractPdfText;
