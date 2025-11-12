/**
 * Extracts the title from the first row of the block
 */
function extractTitle(block) {
  const firstChild = block.querySelector('div');
  return firstChild?.querySelector('div')?.textContent?.trim() || 'Compare Products';
}

/**
 * Checks if a row represents a compare item (has image and text)
 */
function isCompareItem(cells) {
  return cells.length === 2 && cells[0].querySelector('picture, img');
}

/**
 * Checks if a row represents a compare parameter (has 3 values)
 */
function isCompareParameter(cells) {
  return cells.length === 3;
}

/**
 * Parses a compare item row into an object
 */
function parseCompareItem(cells) {
  const img = cells[0].querySelector('picture, img');
  const text = cells[1]?.textContent?.trim() || '';
  return { img, text };
}

/**
 * Parses a compare parameter row into an object
 */
function parseCompareParameter(cells) {
  return {
    paramValue1: cells[1]?.textContent?.trim() || '',
    paramLabel: cells[0]?.textContent?.trim() || '',
    paramValue2: cells[2]?.textContent?.trim() || '',
  };
}

/**
 * Parses the block structure and extracts compare items and parameters
 */
function parseBlockStructure(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const compareItems = [];
  const compareParameters = [];

  rows.forEach((row, index) => {
    if (index === 0) {
      return; // Skip title row
    }

    const cells = [...row.querySelectorAll(':scope > div')];

    if (isCompareItem(cells)) {
      compareItems.push(parseCompareItem(cells));
    } else if (isCompareParameter(cells)) {
      compareParameters.push(parseCompareParameter(cells));
    }
  });

  return { compareItems, compareParameters };
}

/**
 * Creates a side image element for desktop view
 */
function createSideImage(compareItem) {
  if (!compareItem) return null;

  const sideImage = document.createElement('div');
  sideImage.className = 'side-image';

  const img = compareItem.img.cloneNode(true);
  img.alt = compareItem.text;

  sideImage.appendChild(img);
  return sideImage;
}

/**
 * Creates the header grid with product names
 */
function createHeaderGrid(compareItems) {
  const headerGrid = document.createElement('div');
  headerGrid.className = 'header-grid';

  // Left subtitle
  if (compareItems[0]) {
    const leftSubtitle = document.createElement('h3');
    leftSubtitle.className = 'subtitle left';
    leftSubtitle.textContent = compareItems[0].text;
    headerGrid.appendChild(leftSubtitle);
  }

  // Empty middle cell
  headerGrid.appendChild(document.createElement('div'));

  // Right subtitle
  if (compareItems[1]) {
    const rightSubtitle = document.createElement('h3');
    rightSubtitle.className = 'subtitle right';
    rightSubtitle.textContent = compareItems[1].text;
    headerGrid.appendChild(rightSubtitle);
  }

  return headerGrid;
}

/**
 * Creates mobile images section
 */
function createMobileImages(compareItems) {
  const mobileImages = document.createElement('div');
  mobileImages.className = 'mobile-images';

  // Left mobile image
  if (compareItems[0]) {
    const leftMobileDiv = document.createElement('div');
    leftMobileDiv.className = 'left';
    const leftMobileImg = compareItems[0].img.cloneNode(true);
    leftMobileImg.alt = compareItems[0].text;
    leftMobileDiv.appendChild(leftMobileImg);
    mobileImages.appendChild(leftMobileDiv);
  }

  // Empty middle cell
  mobileImages.appendChild(document.createElement('div'));

  // Right mobile image
  if (compareItems[1]) {
    const rightMobileDiv = document.createElement('div');
    rightMobileDiv.className = 'right';
    const rightMobileImg = compareItems[1].img.cloneNode(true);
    rightMobileImg.alt = compareItems[1].text;
    rightMobileDiv.appendChild(rightMobileImg);
    mobileImages.appendChild(rightMobileDiv);
  }

  return mobileImages;
}

/**
 * Creates a comparison row for a parameter
 */
function createComparisonRow(param) {
  const comparisonRow = document.createElement('div');
  comparisonRow.className = 'comparison-row';

  const leftValue = document.createElement('h4');
  leftValue.className = 'comparison-value left';
  leftValue.textContent = param.paramValue1;
  comparisonRow.appendChild(leftValue);

  const label = document.createElement('h4');
  label.className = 'comparison-label';
  label.textContent = param.paramLabel;
  comparisonRow.appendChild(label);

  const rightValue = document.createElement('h4');
  rightValue.className = 'comparison-value right';
  rightValue.textContent = param.paramValue2;
  comparisonRow.appendChild(rightValue);

  return comparisonRow;
}

/**
 * Creates the comparison content section
 */
function createComparisonContent(compareItems, compareParameters) {
  const comparisonContent = document.createElement('div');
  comparisonContent.className = 'comparison-content';

  // Add header grid
  comparisonContent.appendChild(createHeaderGrid(compareItems));

  // Add mobile images
  comparisonContent.appendChild(createMobileImages(compareItems));

  // Add comparison rows for parameters
  compareParameters.forEach((param) => {
    comparisonContent.appendChild(createComparisonRow(param));
  });

  return comparisonContent;
}

/**
 * Creates the main comparison structure
 */
function createComparisonStructure(title, compareItems, compareParameters) {
  const section = document.createElement('section');
  section.className = 'product-comparison';
  section.id = 'COMPAREZ';

  // Create title
  const h2 = document.createElement('h2');
  h2.className = 'title';
  h2.textContent = title;
  section.appendChild(h2);

  // Create comparison wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'comparison-wrapper';

  // Add left side image
  const leftSideImage = createSideImage(compareItems[0]);
  if (leftSideImage) {
    wrapper.appendChild(leftSideImage);
  }

  // Add comparison content
  wrapper.appendChild(createComparisonContent(compareItems, compareParameters));

  // Add right side image
  const rightSideImage = createSideImage(compareItems[1]);
  if (rightSideImage) {
    wrapper.appendChild(rightSideImage);
  }

  section.appendChild(wrapper);
  return section;
}

/**
 * Main decorator function for the compare block
 */
export default function decorate(block) {
  const isAuthor = window?.origin !== undefined && window?.origin.includes('author');

  if (isAuthor) {
    return;
  }
  const title = extractTitle(block);
  const { compareItems, compareParameters } = parseBlockStructure(block);

  const comparisonStructure = createComparisonStructure(title, compareItems, compareParameters);

  // Replace block content
  block.innerHTML = '';
  block.append(comparisonStructure);
}
