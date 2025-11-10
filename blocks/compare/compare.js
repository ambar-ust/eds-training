export default function decorate(block) {
  // Get all the content from the block
  const rows = [...block.children];

  // Clear the block
  block.innerHTML = '';

  const title = rows[0]?.textContent?.trim();
  const leftContent = rows[1]?.innerHTML;
  const rightContent = rows[2]?.innerHTML;
  const images = rows[3]?.querySelectorAll('img');

  // Assign images to left and right (first image to left, second to right if available)
  const leftContentImage = images?.[0];
  const rightContentImage = images?.[1];

  // Create the structure
  const compareHTML = `
    ${title ? `<div class="compare-title"><h2>${title}</h2></div>` : ''}
    <div class="compare-content">
      <div class="compare-left">
        ${leftContentImage ? `
          <div class="compare-image">
            <img src="${leftContentImage.src}" alt="${leftContentImage.alt || ''}" loading="lazy">
          </div>
        ` : ''}
        ${leftContent ? `<div class="compare-text">${leftContent}</div>` : ''}
      </div>
      <div class="compare-right">
        ${rightContentImage ? `
          <div class="compare-image">
            <img src="${rightContentImage.src}" alt="${rightContentImage.alt || ''}" loading="lazy">
          </div>
        ` : ''}
        ${rightContent ? `<div class="compare-text">${rightContent}</div>` : ''}
      </div>
    </div>
  `;

  block.innerHTML = compareHTML;
}
