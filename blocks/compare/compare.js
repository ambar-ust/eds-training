import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Get the title from the first row
  const firstChild = block.querySelector('div');
  const title = firstChild?.querySelector('div')?.textContent?.trim() || 'Compare Products';
  // Parse the block structure
  const rows = [...block.querySelectorAll(':scope > div')];

  // First row is title, next two rows are compareItems, rest are compareParameters
  const compareItems = [];
  const compareParameters = [];

  rows.forEach((row, index) => {
    if (index === 0) {
      // Skip title row
      return;
    }

    const cells = [...row.querySelectorAll(':scope > div')];

    // Check if this is a compareItem (has image and text) or compareParameter (has 3 values)
    if (cells.length === 2 && cells[0].querySelector('picture, img')) {
      // This is a compareItem
      const img = cells[0].querySelector('picture, img');
      const textCell = cells[1];
      const text = textCell?.textContent?.trim() || '';
      compareItems.push({ img, text, textCell });
    } else if (cells.length === 3) {
      // This is a compareParameter
      const labelCell = cells[0];
      const value1Cell = cells[1];
      const value2Cell = cells[2];
      const paramValue1 = value1Cell?.textContent?.trim() || '';
      const paramLabel = labelCell?.textContent?.trim() || '';
      const paramValue2 = value2Cell?.textContent?.trim() || '';
      compareParameters.push({
        paramValue1,
        paramLabel,
        paramValue2,
        labelCell,
        value1Cell,
        value2Cell,
      });
    }
  });

  // Create the comparison structure
  const section = document.createElement('section');
  section.className = 'product-comparison';
  section.id = 'COMPAREZ';

  // Create title
  const h2 = document.createElement('h2');
  h2.className = 'title';
  h2.textContent = title;
  moveInstrumentation(firstChild, h2);
  section.appendChild(h2);

  // Create comparison wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'comparison-wrapper';

  // Left side image
  if (compareItems[0]) {
    const leftSideImage = document.createElement('div');
    leftSideImage.className = 'side-image';
    const leftImg = compareItems[0].img.cloneNode(true);
    leftImg.alt = compareItems[0].text;
    moveInstrumentation(compareItems[0].img, leftImg);
    leftSideImage.appendChild(leftImg);
    wrapper.appendChild(leftSideImage);
  }

  // Comparison content
  const comparisonContent = document.createElement('div');
  comparisonContent.className = 'comparison-content';

  // Header grid with product names
  const headerGrid = document.createElement('div');
  headerGrid.className = 'header-grid';

  if (compareItems[0]) {
    const leftSubtitle = document.createElement('h3');
    leftSubtitle.className = 'subtitle left';
    leftSubtitle.textContent = compareItems[0].text;
    moveInstrumentation(compareItems[0].textCell, leftSubtitle);
    headerGrid.appendChild(leftSubtitle);
  }

  headerGrid.appendChild(document.createElement('div')); // Empty middle cell

  if (compareItems[1]) {
    const rightSubtitle = document.createElement('h3');
    rightSubtitle.className = 'subtitle right';
    rightSubtitle.textContent = compareItems[1].text;
    moveInstrumentation(compareItems[1].textCell, rightSubtitle);
    headerGrid.appendChild(rightSubtitle);
  }

  comparisonContent.appendChild(headerGrid);

  // Mobile images
  const mobileImages = document.createElement('div');
  mobileImages.className = 'mobile-images';

  if (compareItems[0]) {
    const leftMobileDiv = document.createElement('div');
    leftMobileDiv.className = 'left';
    const leftMobileImg = compareItems[0].img.cloneNode(true);
    leftMobileImg.alt = compareItems[0].text;
    moveInstrumentation(compareItems[0].img, leftMobileImg);
    leftMobileDiv.appendChild(leftMobileImg);
    mobileImages.appendChild(leftMobileDiv);
  }

  mobileImages.appendChild(document.createElement('div')); // Empty middle cell

  if (compareItems[1]) {
    const rightMobileDiv = document.createElement('div');
    rightMobileDiv.className = 'right';
    const rightMobileImg = compareItems[1].img.cloneNode(true);
    rightMobileImg.alt = compareItems[1].text;
    moveInstrumentation(compareItems[1].img, rightMobileImg);
    rightMobileDiv.appendChild(rightMobileImg);
    mobileImages.appendChild(rightMobileDiv);
  }

  comparisonContent.appendChild(mobileImages);

  // Comparison rows for parameters
  compareParameters.forEach((param) => {
    const comparisonRow = document.createElement('div');
    comparisonRow.className = 'comparison-row';

    const leftValue = document.createElement('h4');
    leftValue.className = 'comparison-value left';
    leftValue.textContent = param.paramValue1;
    moveInstrumentation(param.value1Cell, leftValue);
    comparisonRow.appendChild(leftValue);

    const label = document.createElement('h4');
    label.className = 'comparison-label';
    label.textContent = param.paramLabel;
    moveInstrumentation(param.labelCell, label);
    comparisonRow.appendChild(label);

    const rightValue = document.createElement('h4');
    rightValue.className = 'comparison-value right';
    rightValue.textContent = param.paramValue2;
    moveInstrumentation(param.value2Cell, rightValue);
    comparisonRow.appendChild(rightValue);

    comparisonContent.appendChild(comparisonRow);
  });

  wrapper.appendChild(comparisonContent);

  // Right side image
  if (compareItems[1]) {
    const rightSideImage = document.createElement('div');
    rightSideImage.className = 'side-image';
    const rightImg = compareItems[1].img.cloneNode(true);
    rightImg.alt = compareItems[1].text;
    moveInstrumentation(compareItems[1].img, rightImg);
    rightSideImage.appendChild(rightImg);
    wrapper.appendChild(rightSideImage);
  }

  section.appendChild(wrapper);

  // Replace block content
  block.innerHTML = '';
  block.append(section);
}
