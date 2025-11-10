export default function decorate(block) {
  // Get all the content from the block
  const rows = [...block.children];
  
  // Clear the block
  block.innerHTML = '';
  
  // Expected structure based on component model:
  // Row 0: Title
  // Row 1: LeftContent
  // Row 2: RightContent  
  // Row 3: RightContentImage
  // Row 4: RightContentImageAlt
  // Row 5: LeftContentImage
  // Row 6: LeftContentImageAlt
  
  const title = rows[0]?.textContent?.trim();
  const leftContent = rows[1]?.innerHTML;
  const rightContent = rows[2]?.innerHTML;
  const rightContentImage = rows[3]?.querySelector('img');
  const rightContentImageAlt = rows[4]?.textContent?.trim();
  const leftContentImage = rows[5]?.querySelector('img');
  const leftContentImageAlt = rows[6]?.textContent?.trim();
  
  // Create the structure
  const compareHTML = `
    ${title ? `<div class="compare-title"><h2>${title}</h2></div>` : ''}
    <div class="compare-content">
      <div class="compare-left">
        ${leftContentImage ? `
          <div class="compare-image">
            <img src="${leftContentImage.src}" alt="${leftContentImageAlt || leftContentImage.alt || ''}" loading="lazy">
          </div>
        ` : ''}
        ${leftContent ? `<div class="compare-text">${leftContent}</div>` : ''}
      </div>
      <div class="compare-right">
        ${rightContentImage ? `
          <div class="compare-image">
            <img src="${rightContentImage.src}" alt="${rightContentImageAlt || rightContentImage.alt || ''}" loading="lazy">
          </div>
        ` : ''}
        ${rightContent ? `<div class="compare-text">${rightContent}</div>` : ''}
      </div>
    </div>
  `;
  
  block.innerHTML = compareHTML;
}