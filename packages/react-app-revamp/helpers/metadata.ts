import { isEntryPreviewPrompt, verifyEntryPreviewPrompt } from "@components/_pages/DialogModalSendProposal/utils";
import { EntryPreview } from "@hooks/useDeployContest/store";
import { MetadataFieldWithInput } from "@hooks/useMetadataFields/store";
import { parseEther } from "viem";

export function processFieldInputs(fieldInputs: MetadataFieldWithInput[]) {
  const fieldsMetadata = {
    addressArray: [] as `0x${string}`[],
    stringArray: [] as string[],
    uintArray: [] as bigint[],
  };

  fieldInputs.forEach(field => {
    switch (field.metadataType) {
      case "address":
        fieldsMetadata.addressArray.push(field.inputValue as `0x${string}`);
        break;
      case "string":
        fieldsMetadata.stringArray.push(field.inputValue);
        break;
      case "uint256":
        fieldsMetadata.uintArray.push(parseEther(field.inputValue));
        break;
      default:
        console.warn(`Unsupported metadata type: ${field.metadataType}`);
    }
  });

  return fieldsMetadata;
}

export function generateFieldInputsHTML(proposalContent: string, fieldInputs: MetadataFieldWithInput[]): string {
  if (fieldInputs.length === 0) return "";

  // skip the first field if it's an entry preview prompt
  const startIndex = isEntryPreviewPrompt(fieldInputs[0].prompt) ? 1 : 0;

  const fieldHTMLs = fieldInputs
    .slice(startIndex)
    .map(
      field => `
        <div class="flex flex-col gap-4">
          <p class="text-neutral-11 italic m-0">${field.prompt}</p>
          <p class="text-neutral-11 m-0">${field.inputValue}</p>
        </div>
    `,
    )
    .join("");

  // only add divider if there are remaining fields to display
  const divider =
    fieldHTMLs && proposalContent.trim().length > 0 ? '<hr class="border-neutral-11 bg-neutral-11 mt-6 mb-6">' : "";

  return fieldHTMLs
    ? `
        ${divider}
        <div class="flex flex-col gap-6">
          ${fieldHTMLs}
        </div>
    `
    : "";
}

export function generateEntryPreviewHTML(fieldInputs: MetadataFieldWithInput[]): string {
  if (fieldInputs.length === 0) {
    return "";
  }

  const firstFieldInput = fieldInputs[0];
  const { enabledPreview } = verifyEntryPreviewPrompt(firstFieldInput.prompt);

  let previewHTML = "";
  switch (enabledPreview) {
    case EntryPreview.TITLE:
      previewHTML = `<p style="font-size: 24px;">${firstFieldInput.inputValue}</p>`;
      break;
    case EntryPreview.IMAGE:
      previewHTML = `<img src="${firstFieldInput.inputValue}" alt="Preview Image" />`;
      break;
    case EntryPreview.TWEET:
      previewHTML = `<a href="${firstFieldInput.inputValue}" target="_blank" rel="noopener noreferrer">${firstFieldInput.inputValue}</a>`;
      break;
    default:
      previewHTML = "";
  }

  return `${previewHTML}`;
}
