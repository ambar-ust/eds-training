export default function decorate(block) {
  // Validate block exists
  if (!block) {
    // eslint-disable-next-line no-console
    console.error('Compare block: block element is null or undefined');
    return;
  }

  // Extract the title (first row if it's a single column)
  const title = block.querySelector(':scope > div > div')?.textContent?.trim() || 'Compare Products';

  // Get all rows
  const rowsNodeList = block.querySelectorAll(':scope > div');
  if (!rowsNodeList || rowsNodeList.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Compare block: no rows found');
    return;
  }
  const rows = [...rowsNodeList];

  // Find compare items (rows with images)
  const compareItems = [];
  const compareParameters = [];

  rows.forEach((row) => {
    if (!row || !row.children) {
      return;
    }

    const cells = [...row.children];

    // Check if this is a compare item (has an image in first cell)
    if (cells.length >= 2 && cells[0]?.querySelector('picture')) {
      const image = cells[0].querySelector('picture');
      const text = cells[1]?.textContent?.trim() || '';
      if (image) {
        compareItems.push({ image, text });
      }
    } else if (cells.length === 3 && !cells[0]?.querySelector('picture')) {
      // Check if this is a parameter row (3 text cells)
      const parameter = cells[0]?.textContent?.trim() || '';
      const value1 = cells[1]?.textContent?.trim() || '';
      const value2 = cells[2]?.textContent?.trim() || '';

      // Skip if this is the title row
      if (parameter && value1 && value2) {
        compareParameters.push({ parameter, value1, value2 });
      }
    } else if (cells.length === 1 && cells[0]?.textContent?.trim()) {
      // This might be the title row - skip it
    }
  });

  // Ensure we have exactly 2 compare items
  if (compareItems.length !== 2) {
    // eslint-disable-next-line no-console
    console.warn(`Compare block requires exactly 2 items, found ${compareItems.length}`);
    return;
  }

  // Clear the block
  block.innerHTML = '';
  block.classList.add('bg-theme', 'text-theme', 'theme-practical');

  // Create section wrapper
  const section = document.createElement('section');
  section.className = 'product-comparison';
  section.setAttribute('data-component', 'product-comparison');

  // Create title container
  const heroContainer = document.createElement('div');
  heroContainer.className = 'hero-container';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'product-comparison-title';
  titleDiv.textContent = title;

  heroContainer.appendChild(titleDiv);
  section.appendChild(heroContainer);

  // Create comparison grid
  const comparisonGrid = document.createElement('div');
  comparisonGrid.className = 'comparison-grid';

  // Add left product image (desktop)
  if (compareItems[0]?.image) {
    const leftImageDesktop = compareItems[0].image.cloneNode(true);
    leftImageDesktop.className = 'product-image-left';
    const leftImg = leftImageDesktop.querySelector('img');
    if (leftImg) {
      leftImg.loading = 'lazy';
      leftImg.alt = compareItems[0].text || 'Product 1';
    }
    comparisonGrid.appendChild(leftImageDesktop);
  }

  // Create comparison content container
  const comparisonContent = document.createElement('div');
  comparisonContent.className = 'comparison-content';

  // Add product headers
  const leftName = document.createElement('h3');
  leftName.className = 'product-name-left';
  leftName.textContent = compareItems[0]?.text || 'Product 1';
  comparisonContent.appendChild(leftName);

  const emptyDiv1 = document.createElement('div');
  comparisonContent.appendChild(emptyDiv1);

  const rightName = document.createElement('h3');
  rightName.className = 'product-name-right';
  rightName.textContent = compareItems[1]?.text || 'Product 2';
  comparisonContent.appendChild(rightName);

  // Add mobile images
  if (compareItems[0]?.image) {
    const leftImageMobile = compareItems[0].image.cloneNode(true);
    leftImageMobile.className = 'product-image-mobile-left';
    const leftImgMobile = leftImageMobile.querySelector('img');
    if (leftImgMobile) {
      leftImgMobile.loading = 'lazy';
      leftImgMobile.alt = compareItems[0].text || 'Product 1';
    }
    comparisonContent.appendChild(leftImageMobile);
  }

  const emptyDiv2 = document.createElement('div');
  comparisonContent.appendChild(emptyDiv2);

  if (compareItems[1]?.image) {
    const rightImageMobile = compareItems[1].image.cloneNode(true);
    rightImageMobile.className = 'product-image-mobile-right';
    const rightImgMobile = rightImageMobile.querySelector('img');
    if (rightImgMobile) {
      rightImgMobile.loading = 'lazy';
      rightImgMobile.alt = compareItems[1].text || 'Product 2';
    }
    comparisonContent.appendChild(rightImageMobile);
  }

  // Add comparison parameters
  if (compareParameters && compareParameters.length > 0) {
    compareParameters.forEach((param) => {
      if (!param) {
        return;
      }

      // Left value
      const leftValue = document.createElement('h4');
      leftValue.className = 'value-left';
      leftValue.textContent = param.value1 || '';
      comparisonContent.appendChild(leftValue);

      // Parameter label
      const label = document.createElement('h4');
      label.className = 'label';
      label.textContent = param.parameter || '';
      comparisonContent.appendChild(label);

      // Right value
      const rightValue = document.createElement('h4');
      rightValue.className = 'value-right';
      rightValue.textContent = param.value2 || '';
      comparisonContent.appendChild(rightValue);
    });
  }

  comparisonGrid.appendChild(comparisonContent);

  // Add right product image (desktop)
  if (compareItems[1]?.image) {
    const rightImageDesktop = compareItems[1].image.cloneNode(true);
    rightImageDesktop.className = 'product-image-right';
    const rightImg = rightImageDesktop.querySelector('img');
    if (rightImg) {
      rightImg.loading = 'lazy';
      rightImg.alt = compareItems[1].text || 'Product 2';
    }
    comparisonGrid.appendChild(rightImageDesktop);
  }

  section.appendChild(comparisonGrid);
  block.appendChild(section);
}
