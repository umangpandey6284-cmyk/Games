import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  ChevronRight, 
  Package, 
  ClipboardList, 
  LayoutDashboard,
  Search,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { Product, CartItem, Order, User } from './types';

// --- Components ---

const UnityAdsBanner = () => {
  useEffect(() => {
    // @ts-ignore
    if (window.UnityAds && window.UnityAds.initialized) {
      // @ts-ignore
      window.UnityAds.show('bannerPlacement');
    }
  }, []);

  return (
    <div className="w-full bg-black/5 border border-black/10 p-2 text-center rounded-xl my-4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-black/30 block mb-1">Unity Ads - Banner</span>
      <div className="h-12 bg-gradient-to-r from-zinc-200 to-zinc-300 rounded flex items-center justify-center">
        <span className="text-xs font-medium text-black/40 italic">Real Ad Content (Game ID: 6015985)</span>
      </div>
    </div>
  );
};

const UnityAdsInterstitial = ({ onClose }: { onClose: () => void }) => {
  useEffect(() => {
    // @ts-ignore
    if (window.UnityAds && window.UnityAds.initialized) {
      // @ts-ignore
      window.UnityAds.show('interstitialPlacement');
    }
  }, []);

  return (
    <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6"
  >
    <div className="text-center space-y-6 max-w-md">
      <span className="text-xs font-bold uppercase tracking-widest text-white/40">Unity Ads - Interstitial</span>
      <div className="aspect-video bg-white/10 rounded-3xl flex items-center justify-center border border-white/10">
        <ShoppingBag className="w-20 h-20 text-white/20" />
      </div>
      <h2 className="text-2xl font-bold text-white">Special Offer Just For You!</h2>
      <p className="text-white/60">Get 20% off your next purchase with code SWIFT20</p>
      <button 
        onClick={onClose}
        className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-white/90 transition-all"
      >
        Close Ad
      </button>
    </div>
    </motion.div>
  );
};

const AuthModal = ({ 
  onSuccess, 
  onClose 
}: { 
  onSuccess: (user: User) => void; 
  onClose: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: email.includes('admin') ? 'admin' : 'user' })
    });
    const data = await res.json();
    if (res.ok) {
      onSuccess(data);
    } else {
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{isLogin ? 'Welcome Back' : 'Join SwiftShop'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100">{error}</div>}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-black/5" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/40">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-black/10 outline-none focus:ring-2 focus:ring-black/5" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black/40">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-black font-bold underline underline-offset-4">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const OrderMap = ({ order }: { order: Order }) => (
  <div className="h-64 w-full rounded-2xl overflow-hidden border border-black/5">
    <MapContainer center={[order.lat, order.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[order.lat, order.lng]}>
        <Popup>
          Order #{order.id} <br /> {order.customer_name}
        </Popup>
      </Marker>
    </MapContainer>
  </div>
);

const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  view, 
  setView,
  user,
  setUser,
  setIsAuthOpen
}: { 
  cartCount: number; 
  onOpenCart: () => void; 
  view: 'store' | 'admin'; 
  setView: (v: 'store' | 'admin') => void;
  user: User | null;
  setUser: (u: User | null) => void;
  setIsAuthOpen: (o: boolean) => void;
}) => (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-bottom border-black/5 px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
      <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
        <ShoppingBag className="text-white w-6 h-6" />
      </div>
      <span className="text-xl font-bold tracking-tight">SwiftShop</span>
    </div>

    <div className="flex items-center gap-4">
      {user?.role === 'admin' && (
        <button 
          onClick={() => setView(view === 'store' ? 'admin' : 'store')}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 hover:bg-black hover:text-white transition-colors text-sm font-medium"
        >
          {view === 'store' ? <Settings size={18} /> : <LayoutDashboard size={18} />}
          {view === 'store' ? 'Admin Panel' : 'Storefront'}
        </button>
      )}

      {!user ? (
        <button 
          onClick={() => setIsAuthOpen(true)}
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-black/60 hidden sm:block">{user.email}</span>
          <button 
            onClick={() => setUser(null)}
            className="px-4 py-2 rounded-full border border-black/10 text-sm font-medium hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
      
      {view === 'store' && (
        <button 
          onClick={onOpenCart}
          className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      )}
    </div>
  </nav>
);

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void; key?: React.Key }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black/60">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-black/50 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/80 transition-colors disabled:bg-black/20 disabled:cursor-not-allowed"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Admin states
  const [adminTab, setAdminTab] = useState<'products' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Initialize Unity Ads SDK
    // @ts-ignore
    if (window.UnityAds) {
      // @ts-ignore
      window.UnityAds.init('6015985', true);
    }
    
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    setOrders(data);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const displayItems = useMemo(() => {
    const items: any[] = [];
    filteredProducts.forEach((p, i) => {
      items.push({ type: 'product', data: p, id: `prod-${p.id}` });
      if (i === 3) {
        items.push({ type: 'ad', id: 'unity-ad-1' });
      }
    });
    return items;
  }, [filteredProducts]);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderData = {
      customer_name: formData.get('name'),
      customer_email: formData.get('email'),
      items: cart,
      total_amount: cartTotal,
      // Simulate random location near San Francisco for demo
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (res.ok) {
      setCart([]);
      setOrderSuccess(true);
      setIsCheckingOut(false);
      fetchProducts();
      fetchOrders();
      setTimeout(() => setOrderSuccess(false), 5000);
    }
  };

  // Admin Actions
  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const method = editingProduct.id ? 'PUT' : 'POST';
    const url = editingProduct.id ? `/api/products/${editingProduct.id}` : '/api/products';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProduct)
    });

    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-black font-sans selection:bg-black selection:text-white">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        view={view}
        setView={setView}
        user={user}
        setUser={setUser}
        setIsAuthOpen={setIsAuthOpen}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === 'store' ? (
          <div className="space-y-8">
            {/* Hero / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Curated Essentials.</h1>
                <p className="text-black/50 text-lg max-w-md">Discover our collection of premium products designed for modern life.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  />
                </div>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-black/5 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {displayItems.map((item) => (
                  item.type === 'product' ? (
                    <ProductCard key={item.id} product={item.data} onAddToCart={addToCart} />
                  ) : (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="sm:col-span-2 lg:col-span-3 xl:col-span-4"
                    >
                      <UnityAdsBanner />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-black/30 text-xl">No products found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <div className="flex bg-white p-1 rounded-xl border border-black/5">
                <button 
                  onClick={() => setAdminTab('products')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminTab === 'products' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                >
                  <Package size={18} />
                  Products
                </button>
                <button 
                  onClick={() => setAdminTab('orders')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminTab === 'orders' ? 'bg-black text-white' : 'hover:bg-black/5'}`}
                >
                  <ClipboardList size={18} />
                  Orders
                </button>
              </div>
            </div>

            {adminTab === 'products' ? (
              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                <div className="p-6 border-b border-black/5 flex justify-between items-center">
                  <h2 className="font-semibold text-lg">Inventory Management</h2>
                  <button 
                    onClick={() => setEditingProduct({ name: '', description: '', price: 0, category: '', image_url: 'https://picsum.photos/400/400', stock: 0 })}
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-black/80 transition-colors"
                  >
                    <Plus size={18} /> Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/5 text-[10px] uppercase tracking-widest font-bold text-black/40">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-black/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                              <span className="font-medium">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-black/60">{p.category}</td>
                          <td className="px-6 py-4 font-mono">${p.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setEditingProduct(p)} className="p-2 hover:bg-black/5 rounded-lg transition-colors"><Edit2 size={16} /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 overflow-hidden">
                  <div className="p-6 border-b border-black/5">
                    <h2 className="font-semibold text-lg">Order History</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-black/5 text-[10px] uppercase tracking-widest font-bold text-black/40">
                        <tr>
                          <th className="px-6 py-4">Order ID</th>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Total</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {orders.map(o => (
                          <tr 
                            key={o.id} 
                            onClick={() => setSelectedOrder(o)}
                            className={`cursor-pointer transition-colors ${selectedOrder?.id === o.id ? 'bg-black/5' : 'hover:bg-black/[0.02]'}`}
                          >
                            <td className="px-6 py-4 font-mono text-sm text-black/40">#{o.id.toString().padStart(4, '0')}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium">{o.customer_name}</span>
                                <span className="text-xs text-black/40">{o.customer_email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-black/60 text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-mono font-bold">${o.total_amount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase rounded-full">
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-black/5">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <ClipboardList size={18} /> Order Tracking
                    </h3>
                    {selectedOrder ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-black/5 rounded-xl">
                          <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-1">Customer</p>
                          <p className="font-medium">{selectedOrder.customer_name}</p>
                          <p className="text-sm text-black/60">{selectedOrder.customer_email}</p>
                        </div>
                        <OrderMap order={selectedOrder} />
                        <p className="text-[10px] text-center text-black/30 italic">Live tracking powered by SwiftShop Maps</p>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-center p-8 bg-black/[0.02] rounded-2xl border border-dashed border-black/10">
                        <p className="text-black/30 text-sm">Select an order to view tracking information.</p>
                      </div>
                    )}
                  </div>
                  <UnityAdsBanner />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center">
                      <ShoppingBag className="text-black/20 w-10 h-10" />
                    </div>
                    <p className="text-black/40">Your cart is empty.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-black font-bold underline underline-offset-4"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image_url} className="w-20 h-20 rounded-xl object-cover border border-black/5" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-black/30 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-black/40 text-sm mb-3">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateCartQuantity(item.id, -1)} className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center hover:bg-black/5">-</button>
                          <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.id, 1)} className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center hover:bg-black/5">+</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-black/5 bg-black/[0.01] space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-black/40 font-medium">Subtotal</span>
                    <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckingOut(true)}
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all group"
                  >
                    Checkout <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckingOut && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckingOut(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold tracking-tight">Checkout</h2>
                  <button onClick={() => setIsCheckingOut(false)} className="p-2 hover:bg-black/5 rounded-full"><X /></button>
                </div>
                
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Full Name</label>
                    <input required name="name" type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Email Address</label>
                    <input required name="email" type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" />
                  </div>
                  
                  <div className="bg-black/5 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/40">Items ({cart.length})</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black/40">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="pt-2 border-t border-black/5 flex justify-between items-center">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all"
                  >
                    Place Order
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-black/5 rounded-full"><X /></button>
                </div>
                
                <form onSubmit={saveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-black/40">Product Name</label>
                      <input 
                        required 
                        value={editingProduct.name}
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-black/40">Description</label>
                      <textarea 
                        required 
                        value={editingProduct.description}
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none h-24 resize-none" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Price ($)</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Stock Quantity</label>
                    <input 
                      required 
                      type="number" 
                      value={editingProduct.stock}
                      onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Category</label>
                    <input 
                      required 
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-black/40">Image URL</label>
                    <input 
                      required 
                      value={editingProduct.image_url}
                      onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})}
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-black/5 outline-none" 
                    />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-black/80 transition-all"
                    >
                      {editingProduct.id ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="text-green-400" />
            <span className="font-bold">Order placed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            onClose={() => setIsAuthOpen(false)}
            onSuccess={(u) => {
              setUser(u);
              setIsAuthOpen(false);
              // Show interstitial ad on login
              setTimeout(() => setShowInterstitial(true), 1000);
            }}
          />
        )}
      </AnimatePresence>

      {/* Interstitial Ad */}
      <AnimatePresence>
        {showInterstitial && (
          <UnityAdsInterstitial onClose={() => setShowInterstitial(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
