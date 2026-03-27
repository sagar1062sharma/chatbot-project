const seedProducts = [
  {
    name: 'Men Classic T-Shirt',
    price: 24.99,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Women Summer Dress',
    price: 39.5,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kids Hoodie',
    price: 29,
    category: 'Children',
    image: 'https://images.unsplash.com/photo-1519238359922-989348752efb?auto=format&fit=crop&w=600&q=80',
  },
];

const storageKey = 'quickshop-products';
const fallbackImage =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80';

const productListEl = document.getElementById('products');
const filtersEl = document.getElementById('category-filters');
const searchEl = document.getElementById('search');
const template = document.getElementById('product-card-template');

const adminDialog = document.getElementById('admin-dialog');
const openAdminBtn = document.getElementById('open-admin');
const productForm = document.getElementById('product-form');

let selectedCategory = 'All';
let searchText = '';
let products = loadProducts();

function loadProducts() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return seedProducts;
  try {
    return JSON.parse(saved);
  } catch {
    return seedProducts;
  }
}

function saveProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

function categoryList() {
  const names = [...new Set(products.map((product) => product.category))];
  return ['All', ...names];
}

function renderFilters() {
  filtersEl.replaceChildren();
  categoryList().forEach((category) => {
    const button = document.createElement('button');
    button.className = `filter-btn${selectedCategory === category ? ' active' : ''}`;
    button.textContent = category;
    button.onclick = () => {
      selectedCategory = category;
      render();
    };
    filtersEl.append(button);
  });
}

function filteredProducts() {
  return products.filter((product) => {
    const matchCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchText = product.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchText;
  });
}

function renderProducts() {
  productListEl.replaceChildren();
  const list = filteredProducts();

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No products found. Try another filter or add a new product.';
    productListEl.append(empty);
    return;
  }

  list.forEach((product) => {
    const node = template.content.cloneNode(true);
    node.querySelector('img').src = product.image || fallbackImage;
    node.querySelector('img').alt = product.name;
    node.querySelector('h3').textContent = product.name;
    node.querySelector('.category').textContent = product.category;
    node.querySelector('.price').textContent = `$${Number(product.price).toFixed(2)}`;
    productListEl.append(node);
  });
}

function render() {
  renderFilters();
  renderProducts();
}

searchEl.addEventListener('input', () => {
  searchText = searchEl.value.trim();
  renderProducts();
});

openAdminBtn.addEventListener('click', () => {
  adminDialog.showModal();
});

productForm.addEventListener('submit', (event) => {
  if (event.submitter?.value !== 'submit') return;

  const formData = new FormData(productForm);
  const name = String(formData.get('name') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const image = String(formData.get('image') || '').trim();
  const priceValue = Number(formData.get('price') || 0);

  if (!name || !category || Number.isNaN(priceValue) || priceValue <= 0) return;

  products.unshift({
    name,
    category,
    image,
    price: priceValue,
  });

  saveProducts();
  productForm.reset();
  adminDialog.close();
  selectedCategory = 'All';
  render();
});

render();
