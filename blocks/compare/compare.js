import { div, h2, h3, h4, section } from '../../scripts/dom-helpers.js';

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

  // Create title element
  const titleEl = h2({ class: 'title' }, title);

  // Left side image
  const leftSideImage = compareItems[0]
    ? (() => {
        const leftImg = compareItems[0].img.cloneNode(true);
        leftImg.alt = compareItems[0].text;

        return div({ class: 'side-image' }, leftImg);
      })()
    : null;

  // Header grid with product names
  const leftSubtitle = compareItems[0]
    ? (() => {
        h3({ class: 'subtitle left' }, compareItems[0].text);
      })()
    : null;

  const rightSubtitle = compareItems[1]
    ? (() => {
        const subtitle = h3({ class: 'subtitle right' }, compareItems[1].text);

        return subtitle;
      })()
    : null;

  const headerGrid = div(
    { class: 'header-grid' },
    ...[leftSubtitle, div(), rightSubtitle].filter(Boolean),
  );

  // Mobile images
  const leftMobileDiv = compareItems[0]
    ? (() => {
        const leftMobileImg = compareItems[0].img.cloneNode(true);
        leftMobileImg.alt = compareItems[0].text;

        return div({ class: 'left' }, leftMobileImg);
      })()
    : null;

  const rightMobileDiv = compareItems[1]
    ? (() => {
        const rightMobileImg = compareItems[1].img.cloneNode(true);
        rightMobileImg.alt = compareItems[1].text;

        return div({ class: 'right' }, rightMobileImg);
      })()
    : null;

  const mobileImages = div(
    { class: 'mobile-images' },
    ...[leftMobileDiv, div(), rightMobileDiv].filter(Boolean),
  );

  // Comparison rows for parameters
  const comparisonRows = compareParameters.map((param) => {
    const leftValue = h4({ class: 'comparison-value left' }, param.paramValue1);

    const label = h4({ class: 'comparison-label' }, param.paramLabel);

    const rightValue = h4({ class: 'comparison-value right' }, param.paramValue2);

    return div({ class: 'comparison-row' }, leftValue, label, rightValue);
  });

  // Comparison content
  const comparisonContent = div(
    { class: 'comparison-content' },
    headerGrid,
    mobileImages,
    ...comparisonRows,
  );

  // Right side image
  const rightSideImage = compareItems[1]
    ? (() => {
        const rightImg = compareItems[1].img.cloneNode(true);
        rightImg.alt = compareItems[1].text;
      })()
    : null;

  // Create comparison wrapper
  const wrapper = div(
    { class: 'comparison-wrapper' },
    ...[leftSideImage, comparisonContent, rightSideImage].filter(Boolean),
  );

  // Create the comparison structure
  const sectionEl = section({ class: 'product-comparison', id: 'COMPAREZ' }, titleEl, wrapper);

  // Replace block content
  block.innerHTML = '';
  block.append(sectionEl);
}
