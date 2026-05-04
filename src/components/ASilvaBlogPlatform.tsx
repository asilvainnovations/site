import React, { useState, useEffect } from 'react';
import { Camera, Plus, Eye, Edit3, Trash2, Save, X, Calendar, Tag, Share2, Search, Menu, Sun, Moon, Users, BarChart3, Mail, Settings, Image as ImageIcon, Video, Code, Link as LinkIcon, Bold, Italic, List, AlignLeft, ChevronDown, Upload, AlertCircle, Check, TrendingUp, FileText, Layout, Zap } from 'lucide-react';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  tags: string[];
  featuredImage: string;
  views: number;
  readTime: number;
}

export interface ASilvaBlogPlatformProps {
  initialPosts?: BlogPost[];
  onPostCreate?: (post: BlogPost) => void;
  onPostUpdate?: (post: BlogPost) => void;
  onPostDelete?: (postId: number) => void;
}

export const useBlogPosts = (initialPosts?: BlogPost[]) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);

  const addPost = (post: BlogPost) => {
    setPosts(prev => [...prev, post]);
  };

  const updatePost = (post: BlogPost) => {
    setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  };

  const deletePost = (postId: number) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return { posts, addPost, updatePost, deletePost, setPosts };
};

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Main Blog Platform Component
const ASilvaBlogPlatform = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, posts, new-post, analytics, settings
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'The Future of Systems Innovation: A Holistic Approach',
      slug: 'future-systems-innovation-holistic-approach',
      excerpt: 'Exploring how integrated systems thinking transforms organizational resilience and strategic outcomes.',
      content: '<p>Full article content here...</p>',
      author: 'ASilva Innovations',
      publishDate: '2026-01-28',
      status: 'published',
      category: 'Systems Innovation',
      tags: ['innovation', 'systems thinking', 'strategy'],
      featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
      views: 1247,
      readTime: 8
    },
    {
      id: 2,
      title: 'Risk & Resilience: Building Antifragile Organizations',
      slug: 'risk-resilience-antifragile-organizations',
      excerpt: 'How modern organizations can thrive in uncertainty through integrated risk management.',
      content: '<p>Full article content here...</p>',
      author: 'ASilva Innovations',
      publishDate: '2026-01-25',
      status: 'published',
      category: 'Risk Management',
      tags: ['risk', 'resilience', 'antifragility'],
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      views: 892,
      readTime: 10
    },
    {
      id: 3,
      title: 'Strategic Thinking: The Science Behind Better Decisions',
      slug: 'strategic-thinking-science-better-decisions',
      excerpt: 'Leveraging cognitive science and systems analysis for superior strategic outcomes.',
      content: '<p>Full article content here...</p>',
      author: 'ASilva Innovations',
      publishDate: '2026-01-22',
      status: 'draft',
      category: 'Strategic Thinking',
      tags: ['strategy', 'decision-making', 'cognitive science'],
      featuredImage: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200',
      views: 0,
      readTime: 12
    }
  ]);
  
  const [currentPost, setCurrentPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const categories = ['Systems Innovation', 'Risk Management', 'Strategic Thinking', 'AI & Analytics', 'Well-Being'];
  
  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitIntent]);

  // Editor Component
  const BlogEditor = ({ post, onSave, onCancel }) => {
    const [editPost, setEditPost] = useState(post || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: categories[0],
      tags: [],
      featuredImage: '',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0]
    });
    const [tagInput, setTagInput] = useState('');

    const updateSlug = (title) => {
      return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const handleTitleChange = (title) => {
      setEditPost({
        ...editPost,
        title,
        slug: updateSlug(title)
      });
    };

    const addTag = () => {
      if (tagInput && !editPost.tags.includes(tagInput)) {
        setEditPost({
          ...editPost,
          tags: [...editPost.tags, tagInput]
        });
        setTagInput('');
      }
    };

    const removeTag = (tag) => {
      setEditPost({
        ...editPost,
        tags: editPost.tags.filter(t => t !== tag)
      });
    };

    return (
      <div className="editor-container">
        <div className="editor-header">
          <h2 className="editor-title">
            <Edit3 size={24} />
            {post ? 'Edit Post' : 'New Post'}
          </h2>
          <div className="editor-actions">
            <button className="btn btn-secondary" onClick={onCancel}>
              <X size={18} /> Cancel
            </button>
            <button className="btn btn-primary" onClick={() => onSave(editPost)}>
              <Save size={18} /> {editPost.status === 'published' ? 'Update' : 'Save Draft'}
            </button>
            <button className="btn btn-success" onClick={() => onSave({...editPost, status: 'published'})}>
              <Eye size={18} /> Publish
            </button>
          </div>
        </div>

        <div className="editor-body">
          <div className="editor-main">
            {/* Title */}
            <input
              type="text"
              className="editor-title-input"
              placeholder="Enter your post title..."
              value={editPost.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />

            {/* Slug */}
            <div className="editor-field">
              <label>URL Slug</label>
              <input
                type="text"
                className="editor-input"
                value={editPost.slug}
                onChange={(e) => setEditPost({...editPost, slug: e.target.value})}
                placeholder="post-url-slug"
              />
              <span className="field-hint">yoursite.com/blog/{editPost.slug || 'post-url-slug'}</span>
            </div>

            {/* Excerpt */}
            <div className="editor-field">
              <label>Excerpt (Meta Description)</label>
              <textarea
                className="editor-textarea"
                rows="3"
                value={editPost.excerpt}
                onChange={(e) => setEditPost({...editPost, excerpt: e.target.value})}
                placeholder="Brief description for SEO and social sharing (150-160 characters recommended)"
                maxLength="160"
              />
              <span className="field-hint">{editPost.excerpt.length}/160 characters</span>
            </div>

            {/* Content Editor */}
            <div className="editor-field">
              <label>Content</label>
              <div className="editor-toolbar">
                <button className="toolbar-btn" title="Bold"><Bold size={18} /></button>
                <button className="toolbar-btn" title="Italic"><Italic size={18} /></button>
                <button className="toolbar-btn" title="List"><List size={18} /></button>
                <button className="toolbar-btn" title="Link"><LinkIcon size={18} /></button>
                <button className="toolbar-btn" title="Image"><ImageIcon size={18} /></button>
                <button className="toolbar-btn" title="Video"><Video size={18} /></button>
                <button className="toolbar-btn" title="Code"><Code size={18} /></button>
              </div>
              <textarea
                className="editor-content"
                rows="15"
                value={editPost.content}
                onChange={(e) => setEditPost({...editPost, content: e.target.value})}
                placeholder="Write your content here... (Supports HTML and Markdown)"
              />
            </div>

            {/* Featured Image */}
            <div className="editor-field">
              <label>Featured Image URL</label>
              <input
                type="text"
                className="editor-input"
                value={editPost.featuredImage}
                onChange={(e) => setEditPost({...editPost, featuredImage: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
              {editPost.featuredImage && (
                <img src={editPost.featuredImage} alt="Preview" className="image-preview" />
              )}
            </div>
          </div>

          <div className="editor-sidebar">
            {/* Publish Settings */}
            <div className="sidebar-panel">
              <h3 className="panel-title">Publish Settings</h3>
              
              <div className="editor-field">
                <label>Status</label>
                <select 
                  className="editor-select"
                  value={editPost.status}
                  onChange={(e) => setEditPost({...editPost, status: e.target.value})}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="editor-field">
                <label>Publish Date</label>
                <input
                  type="date"
                  className="editor-input"
                  value={editPost.publishDate}
                  onChange={(e) => setEditPost({...editPost, publishDate: e.target.value})}
                />
              </div>
            </div>

            {/* Category */}
            <div className="sidebar-panel">
              <h3 className="panel-title">Category</h3>
              <select 
                className="editor-select"
                value={editPost.category}
                onChange={(e) => setEditPost({...editPost, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="sidebar-panel">
              <h3 className="panel-title">Tags</h3>
              <div className="tag-input-container">
                <input
                  type="text"
                  className="editor-input"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <button className="btn btn-sm btn-primary" onClick={addTag}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="tag-list">
                {editPost.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button onClick={() => removeTag(tag)}><X size={14} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO Preview */}
            <div className="sidebar-panel">
              <h3 className="panel-title">SEO Preview</h3>
              <div className="seo-preview">
                <div className="seo-title">{editPost.title || 'Your Post Title'}</div>
                <div className="seo-url">yoursite.com › {editPost.slug || 'post-slug'}</div>
                <div className="seo-description">{editPost.excerpt || 'Your post excerpt will appear here...'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard</h1>
        <button className="btn btn-primary" onClick={() => {
          setCurrentPost(null);
          setActiveView('new-post');
        }}>
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Posts</div>
            <div className="stat-value">{posts.length}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} /> +2 this week
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">{posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</div>
            <div className="stat-change positive">
              <TrendingUp size={14} /> +18% this month
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Subscribers</div>
            <div className="stat-value">1,429</div>
            <div className="stat-change positive">
              <TrendingUp size={14} /> +127 this month
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Avg. Performance</div>
            <div className="stat-value">94/100</div>
            <div className="stat-change positive">
              <Check size={14} /> Excellent
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-posts">
          <h2 className="section-title">Recent Posts</h2>
          <div className="post-list">
            {posts.slice(0, 5).map(post => (
              <div key={post.id} className="post-list-item">
                <img src={post.featuredImage} alt={post.title} className="post-list-thumbnail" />
                <div className="post-list-content">
                  <h3 className="post-list-title">{post.title}</h3>
                  <div className="post-list-meta">
                    <span className={`status-badge status-${post.status}`}>{post.status}</span>
                    <span>{post.category}</span>
                    <span>{post.views} views</span>
                    <span>{post.publishDate}</span>
                  </div>
                </div>
                <div className="post-list-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => {
                    setCurrentPost(post);
                    setActiveView('new-post');
                  }}>
                    <Edit3 size={16} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">Quick Actions</h3>
            <button className="widget-btn" onClick={() => setActiveView('new-post')}>
              <Plus size={18} /> Create New Post
            </button>
            <button className="widget-btn" onClick={() => setActiveView('analytics')}>
              <BarChart3 size={18} /> View Analytics
            </button>
            <button className="widget-btn" onClick={() => setActiveView('settings')}>
              <Settings size={18} /> Site Settings
            </button>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Top Categories</h3>
            {categories.map(cat => {
              const count = posts.filter(p => p.category === cat).length;
              return (
                <div key={cat} className="category-stat">
                  <span>{cat}</span>
                  <span className="category-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Posts List Component
  const PostsList = () => {
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="posts-view">
        <div className="posts-header">
          <h1 className="page-title">All Posts</h1>
          <button className="btn btn-primary" onClick={() => {
            setCurrentPost(null);
            setActiveView('new-post');
          }}>
            <Plus size={18} /> New Post
          </button>
        </div>

        <div className="posts-toolbar">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select className="filter-select">
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-card-image" style={{backgroundImage: `url(${post.featuredImage})`}}>
                <span className={`status-badge status-${post.status}`}>{post.status}</span>
              </div>
              <div className="post-card-content">
                <h3 className="post-card-title">{post.title}</h3>
                <p className="post-card-excerpt">{post.excerpt}</p>
                <div className="post-card-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-views"><Eye size={14} /> {post.views}</span>
                </div>
                <div className="post-card-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="tag-small">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="post-card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => {
                  setCurrentPost(post);
                  setActiveView('new-post');
                }}>
                  <Edit3 size={14} /> Edit
                </button>
                <button className="btn btn-sm btn-outline">
                  <Eye size={14} /> Preview
                </button>
                <button className="btn btn-sm btn-danger">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Analytics Component
  const Analytics = () => (
    <div className="analytics-view">
      <h1 className="page-title">Analytics</h1>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Traffic Overview</h3>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Traffic chart would render here with actual data visualization library</p>
          </div>
        </div>
        <div className="analytics-card">
          <h3>Top Performing Posts</h3>
          <div className="top-posts-list">
            {[...posts].sort((a, b) => b.views - a.views).slice(0, 5).map((post, idx) => (
              <div key={post.id} className="top-post-item">
                <span className="top-post-rank">#{idx + 1}</span>
                <div>
                  <div className="top-post-title">{post.title}</div>
                  <div className="top-post-views">{post.views} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Settings Component
  const Settings = () => (
    <div className="settings-view">
      <h1 className="page-title">Settings</h1>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Site Information</h3>
          <div className="editor-field">
            <label>Site Title</label>
            <input type="text" className="editor-input" defaultValue="ASilva Innovations Blog" />
          </div>
          <div className="editor-field">
            <label>Tagline</label>
            <input type="text" className="editor-input" defaultValue="Insights on Systems Innovation & Strategic Thinking" />
          </div>
          <div className="editor-field">
            <label>Site URL</label>
            <input type="text" className="editor-input" defaultValue="https://asilva-innovations.com" />
          </div>
        </div>
        
        <div className="settings-card">
          <h3>SEO Settings</h3>
          <div className="editor-field">
            <label>Default Meta Description</label>
            <textarea className="editor-textarea" rows="3" defaultValue="Explore cutting-edge insights on systems innovation, risk management, strategic thinking, and AI analytics." />
          </div>
          <div className="editor-field">
            <label>
              <input type="checkbox" defaultChecked /> Generate XML Sitemap
            </label>
          </div>
          <div className="editor-field">
            <label>
              <input type="checkbox" defaultChecked /> Enable Schema Markup
            </label>
          </div>
        </div>

        <div className="settings-card">
          <h3>Newsletter Integration</h3>
          <div className="editor-field">
            <label>Email Service Provider</label>
            <select className="editor-select">
              <option>Mailchimp</option>
              <option>ConvertKit</option>
              <option>Beehiiv</option>
              <option>Substack</option>
            </select>
          </div>
          <div className="editor-field">
            <label>API Key</label>
            <input type="password" className="editor-input" placeholder="Enter your API key" />
          </div>
        </div>

        <div className="settings-card">
          <h3>Performance</h3>
          <div className="editor-field">
            <label>
              <input type="checkbox" defaultChecked /> Enable Caching
            </label>
          </div>
          <div className="editor-field">
            <label>
              <input type="checkbox" defaultChecked /> Image Optimization
            </label>
          </div>
          <div className="editor-field">
            <label>
              <input type="checkbox" defaultChecked /> Lazy Load Images
            </label>
          </div>
        </div>
      </div>
      <button className="btn btn-primary" style={{marginTop: '2rem'}}>
        <Save size={18} /> Save Settings
      </button>
    </div>
  );

  // Exit Intent Modal
  const ExitIntentModal = () => (
    <div className="modal-overlay" onClick={() => setShowExitIntent(false)}>
      <div className="modal exit-intent-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowExitIntent(false)}>
          <X size={24} />
        </button>
        <h2 className="modal-title">Wait! Don't Miss Out</h2>
        <p className="modal-text">
          Get exclusive insights on systems innovation, strategic thinking, and AI analytics delivered to your inbox.
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
          />
          <button className="btn btn-primary">
            <Mail size={18} /> Subscribe
          </button>
        </div>
        <p className="modal-fine-print">Join 1,429 subscribers. No spam, unsubscribe anytime.</p>
      </div>
    </div>
  );

  return (
    <div className={`blog-platform ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-container">
            <img
              src="https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png?1769853277"
              alt="ASilva Innovations"
              className="logo-icon"
            />
            <div className="logo-text">
              <div className="logo-title">ASilva Innovations</div>
              <div className="logo-subtitle">Content Management</div>
            </div>
          </div>
        </div>
        
        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="icon-btn">
            <Settings size={20} />
          </button>
          <div className="user-menu">
            <div className="user-avatar">AD</div>
            <span className="user-name">Admin</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </nav>

      <div className="platform-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          
          <div className="sidebar-nav">
            <button 
              className={`sidebar-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveView('dashboard')}
            >
              <Layout size={20} />
              {sidebarOpen && <span>Dashboard</span>}
            </button>
            
            <button 
              className={`sidebar-item ${activeView === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveView('posts')}
            >
              <FileText size={20} />
              {sidebarOpen && <span>All Posts</span>}
            </button>
            
            <button 
              className={`sidebar-item ${activeView === 'new-post' ? 'active' : ''}`}
              onClick={() => {
                setCurrentPost(null);
                setActiveView('new-post');
              }}
            >
              <Plus size={20} />
              {sidebarOpen && <span>New Post</span>}
            </button>
            
            <button 
              className={`sidebar-item ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveView('analytics')}
            >
              <BarChart3 size={20} />
              {sidebarOpen && <span>Analytics</span>}
            </button>
            
            <button 
              className={`sidebar-item ${activeView === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveView('settings')}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeView === 'dashboard' && <Dashboard />}
          {activeView === 'posts' && <PostsList />}
          {activeView === 'new-post' && (
            <BlogEditor 
              post={currentPost} 
              onSave={(post) => {
                if (post.id) {
                  setPosts(posts.map(p => p.id === post.id ? post : p));
                } else {
                  setPosts([...posts, {...post, id: Date.now(), views: 0, readTime: 8}]);
                }
                setActiveView('posts');
                setCurrentPost(null);
              }}
              onCancel={() => {
                setActiveView('posts');
                setCurrentPost(null);
              }}
            />
          )}
          {activeView === 'analytics' && <Analytics />}
          {activeView === 'settings' && <Settings />}
        </main>
      </div>

      {/* Exit Intent Modal */}
      {showExitIntent && <ExitIntentModal />}
    </div>
  );
};

// Styles
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Crimson+Pro:wght@400;600&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .blog-platform {
    --primary: #2563eb;
    --primary-dark: #1e40af;
    --secondary: #64748b;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --background: #ffffff;
    --surface: #f8fafc;
    --surface-hover: #f1f5f9;
    --border: #e2e8f0;
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-tertiary: #94a3b8;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    --gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    min-height: 100vh;
    background: var(--background);
    color: var(--text-primary);
    transition: var(--transition);
  }

  .blog-platform.dark-mode {
    --background: #0f172a;
    --surface: #1e293b;
    --surface-hover: #334155;
    --border: #334155;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-tertiary: #64748b;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  }

  /* Navbar */
  .navbar {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    object-fit: cover;
    display: block;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
  }

  .logo-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .logo-subtitle {
    font-size: 12px;
    color: var(--text-tertiary);
    font-weight: 500;
    margin-top: 2px;
  }

  .navbar-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
  }

  .icon-btn:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    background: var(--surface-hover);
    cursor: pointer;
    transition: var(--transition);
  }

  .user-menu:hover {
    background: var(--border);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--gradient-2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
  }

  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Platform Container */
  .platform-container {
    display: flex;
    height: calc(100vh - 70px);
  }

  /* Sidebar */
  .sidebar {
    width: 260px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 1.5rem 1rem;
    transition: var(--transition);
    position: relative;
  }

  .sidebar.closed {
    width: 80px;
  }

  .sidebar-toggle {
    position: absolute;
    top: 1rem;
    right: -15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    transition: var(--transition);
    z-index: 10;
  }

  .sidebar-toggle:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
  }

  .sidebar-item:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  .sidebar-item.active {
    background: var(--primary);
    color: white;
  }

  .sidebar.closed .sidebar-item {
    justify-content: center;
  }

  .sidebar.closed .sidebar-item span {
    display: none;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    overflow-y: auto;
    background: var(--background);
  }

  /* Dashboard */
  .dashboard {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -1px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    gap: 1.25rem;
    transition: var(--transition);
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    font-size: 13px;
    color: var(--text-tertiary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .stat-change {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .stat-change.positive {
    color: var(--success);
  }

  .dashboard-content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;
  }

  .recent-posts {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  .post-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .post-list-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--background);
    border: 1px solid var(--border);
    transition: var(--transition);
  }

  .post-list-item:hover {
    background: var(--surface-hover);
    transform: translateX(4px);
  }

  .post-list-thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .post-list-content {
    flex: 1;
    min-width: 0;
  }

  .post-list-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-list-meta {
    display: flex;
    gap: 0.75rem;
    font-size: 13px;
    color: var(--text-tertiary);
    flex-wrap: wrap;
  }

  .post-list-actions {
    display: flex;
    align-items: center;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .status-published {
    background: #d1fae5;
    color: #065f46;
  }

  .status-draft {
    background: #fef3c7;
    color: #92400e;
  }

  .status-scheduled {
    background: #dbeafe;
    color: #1e40af;
  }

  .dark-mode .status-published {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
  }

  .dark-mode .status-draft {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  }

  .dark-mode .status-scheduled {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
  }

  .dashboard-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-widget {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem;
  }

  .widget-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .widget-btn {
    width: 100%;
    padding: 0.875rem 1rem;
    border-radius: 10px;
    background: var(--background);
    border: 1px solid var(--border);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: var(--transition);
    margin-bottom: 0.5rem;
  }

  .widget-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    transform: translateX(4px);
  }

  .category-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border);
    font-size: 14px;
  }

  .category-stat:last-child {
    border-bottom: none;
  }

  .category-count {
    background: var(--background);
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  /* Posts View */
  .posts-view {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-out;
  }

  .posts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .posts-toolbar {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-bar {
    flex: 1;
    min-width: 300px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-tertiary);
  }

  .search-bar input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 15px;
    outline: none;
  }

  .filter-select {
    padding: 0.875rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    outline: none;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .post-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: var(--transition);
  }

  .post-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .post-card-image {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 1rem;
  }

  .post-card-content {
    padding: 1.5rem;
  }

  .post-card-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }

  .post-card-excerpt {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .post-card-meta {
    display: flex;
    gap: 1rem;
    font-size: 13px;
    margin-bottom: 1rem;
  }

  .post-category {
    padding: 0.25rem 0.75rem;
    background: var(--background);
    border-radius: 6px;
    font-weight: 600;
    color: var(--primary);
  }

  .post-views {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-tertiary);
  }

  .post-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag-small {
    padding: 0.25rem 0.75rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .post-card-actions {
    display: flex;
    gap: 0.5rem;
    padding: 0 1.5rem 1.5rem;
  }

  /* Editor */
  .editor-container {
    height: calc(100vh - 70px);
    display: flex;
    flex-direction: column;
    background: var(--background);
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .editor-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .editor-actions {
    display: flex;
    gap: 0.75rem;
  }

  .editor-body {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 400px;
    overflow: hidden;
  }

  .editor-main {
    overflow-y: auto;
    padding: 2rem;
  }

  .editor-title-input {
    width: 100%;
    font-size: 36px;
    font-weight: 700;
    font-family: 'Crimson Pro', serif;
    color: var(--text-primary);
    background: transparent;
    border: none;
    outline: none;
    padding: 1rem 0;
    margin-bottom: 1rem;
  }

  .editor-title-input::placeholder {
    color: var(--text-tertiary);
  }

  .editor-field {
    margin-bottom: 1.5rem;
  }

  .editor-field label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .editor-input,
  .editor-select,
  .editor-textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-primary);
    font-size: 15px;
    font-family: inherit;
    outline: none;
    transition: var(--transition);
  }

  .editor-input:focus,
  .editor-select:focus,
  .editor-textarea:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .field-hint {
    display: block;
    font-size: 13px;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
  }

  .editor-toolbar {
    display: flex;
    gap: 0.25rem;
    padding: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px 10px 0 0;
    border-bottom: none;
  }

  .toolbar-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
  }

  .toolbar-btn:hover {
    background: var(--background);
    color: var(--text-primary);
  }

  .editor-content {
    min-height: 400px;
    font-family: 'Crimson Pro', serif;
    font-size: 18px;
    line-height: 1.7;
    border-radius: 0 0 10px 10px;
  }

  .image-preview {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 10px;
    margin-top: 1rem;
  }

  .editor-sidebar {
    background: var(--surface);
    border-left: 1px solid var(--border);
    overflow-y: auto;
    padding: 2rem 1.5rem;
  }

  .sidebar-panel {
    margin-bottom: 2rem;
  }

  .panel-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .tag-input-container {
    display: flex;
    gap: 0.5rem;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    color: var(--text-primary);
  }

  .tag button {
    background: none;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    transition: var(--transition);
  }

  .tag button:hover {
    color: var(--danger);
  }

  .seo-preview {
    padding: 1rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .seo-title {
    font-size: 18px;
    color: #1a0dab;
    font-weight: 400;
    margin-bottom: 0.25rem;
  }

  .dark-mode .seo-title {
    color: #8ab4f8;
  }

  .seo-url {
    font-size: 14px;
    color: #006621;
    margin-bottom: 0.5rem;
  }

  .dark-mode .seo-url {
    color: #93c5fd;
  }

  .seo-description {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  /* Analytics */
  .analytics-view {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-out;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .analytics-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
  }

  .analytics-card h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  .chart-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    background: var(--background);
    border-radius: 12px;
    color: var(--text-tertiary);
    text-align: center;
    padding: 2rem;
  }

  .top-posts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .top-post-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .top-post-rank {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--gradient-1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
  }

  .top-post-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .top-post-views {
    font-size: 13px;
    color: var(--text-tertiary);
  }

  /* Settings */
  .settings-view {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease-out;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .settings-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
  }

  .settings-card h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .btn-secondary {
    background: var(--surface);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background: var(--surface-hover);
  }

  .btn-success {
    background: var(--success);
    color: white;
  }

  .btn-success:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .btn-danger {
    background: var(--danger);
    color: white;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .btn-outline {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .btn-outline:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
  }

  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 13px;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease-out;
  }

  .modal {
    background: var(--surface);
    border-radius: 20px;
    padding: 3rem;
    max-width: 500px;
    width: 90%;
    position: relative;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--background);
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .modal-close:hover {
    background: var(--danger);
    color: white;
  }

  .modal-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .modal-text {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .newsletter-form {
    display: flex;
    gap: 0.75rem;
  }

  .newsletter-input {
    flex: 1;
    padding: 1rem 1.25rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 15px;
    outline: none;
  }

  .newsletter-input:focus {
    border-color: var(--primary);
  }

  .modal-fine-print {
    font-size: 13px;
    color: var(--text-tertiary);
    text-align: center;
    margin-top: 1rem;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .editor-body {
      grid-template-columns: 1fr;
    }

    .editor-sidebar {
      border-left: none;
      border-top: 1px solid var(--border);
    }

    .dashboard-content {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 0 1rem;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 70px;
      height: calc(100vh - 70px);
      z-index: 99;
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export { ASilvaBlogPlatform };
export default ASilvaBlogPlatform;