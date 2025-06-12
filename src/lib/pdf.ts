import { getDocument, type PDFDocumentProxy } from 'pdfjs-dist';

export interface PdfMetadata {
  title?: string;
  author?: string;
  series?: string;
}

export const extractPdfMetadata = async (
  file: File,
): Promise<PdfMetadata> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = getDocument({ data: arrayBuffer });
    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const { info } = await pdf.getMetadata();
    pdf.destroy();
    return {
      title: typeof info.Title === 'string' ? info.Title : undefined,
      author: typeof info.Author === 'string' ? info.Author : undefined,
      series: typeof (info as any).Series === 'string' ? (info as any).Series : undefined,
    };
  } catch {
    return {};
  }
};
