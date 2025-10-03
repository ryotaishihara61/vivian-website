
import { useState, useEffect, useRef } from 'react';

interface BlogPost {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl: string;
}

export default function Home() {
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const [showAllNews, setShowAllNews] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(true);

  // Touch/swipe handling refs
  const testimonialRef = useRef<HTMLDivElement>(null);
  const imageSlideRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // 画像マッピング
  const imageMapping: { [key: string]: string } = {
    "声を失って気づいたこと、カンボジアで取り戻した生きる力": "blog_001.jpg"
  };

  // デフォルト画像の取得
  const getDefaultImage = (index: number): string => {
    const defaultImages = [
      '/assets/images/blog/default-1.jpg',
      '/assets/images/blog/default-2.jpg',
      '/assets/images/blog/default-3.jpg',
      '/assets/images/blog/default-4.jpg',
      '/assets/images/blog/default-5.jpg',
      '/assets/images/blog/default-6.jpg'
    ];
    return defaultImages[index % defaultImages.length];
  };

  // ブログ記事の画像URL取得
  const getBlogImageUrl = (title: string, index: number): string => {
    // imageMappingに登録があればそれを使用
    if (imageMapping[title]) {
      return `/assets/images/blog/${imageMapping[title]}`;
    }
    // なければデフォルト画像を循環使用
    return getDefaultImage(index);
  };

  // Fetch blog posts from note RSS feed
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://note.com/ran_ishihara/rss')}`);
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        const items = xml.querySelectorAll('item');

        const posts: BlogPost[] = Array.from(items).slice(0, 6).map((item, index) => {
          const title = item.querySelector('title')?.textContent || '';
          const description = item.querySelector('description')?.textContent?.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || '';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';

          // 記事タイトルをコンソールに出力（デバッグ用）
          console.log(`記事 ${index + 1}: "${title}"`);

          // 画像URLの取得（マッピングまたはデフォルト）
          const imageUrl = getBlogImageUrl(title, index);

          return {
            title,
            description,
            link,
            pubDate: new Date(pubDate).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
            imageUrl
          };
        });

        setBlogPosts(posts);
        setLoadingBlog(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // エラー時はサンプル記事を表示
        const samplePosts: BlogPost[] = [
          {
            title: 'ブログ記事をお楽しみに',
            description: '最新の記事を準備中です。もう少しお待ちください...',
            link: 'https://note.com/ran_ishihara',
            pubDate: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
            imageUrl: getDefaultImage(0)
          }
        ];
        setBlogPosts(samplePosts);
        setLoadingBlog(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Schema.org JSON-LD構造化データを動的に追加
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://example.com';

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": "セルフラブ絵本ビビアン",
      "description": "朗読とワークで「弱みを好きになれる」セルフラブの物語。子どもたちが自分らしさを大切にし、他者を尊敬する心を育む絵本です。",
      "author": {
        "@type": "Organization",
        "name": "@selflove.laboratory"
      },
      "publisher": {
        "@type": "Organization",
        "name": "@selflove.laboratory"
      },
      "genre": "Children's Book",
      "audience": {
        "@type": "Audience",
        "audienceType": "Children"
      },
      "educationalUse": "情操教育",
      "keywords": "絵本,セルフラブ,情操教育,読み聞かせ,子ども,教育,自己肯定感",
      "image": "https://readdy.ai/api/search-image?query=Beautiful%20childrens%20picture%20book%20cover%20with%20rainbow%20theme%2C%20soft%20pastel%20colors%2C%20whimsical%20illustration%20style%2C%20title%20Vivian%20prominently%20displayed%2C%20heartwarming%20and%20educational%20design%20for%20self-love%20story&width=400&height=600&seq=book-cover-main&orientation=portrait",
      "url": siteUrl,
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "description": "読み聞かせ会のご依頼承ります"
      }
    };

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "@selflove.laboratory",
      "description": "セルフラブ絵本「ビビアン」を通じて、子どもたちの心の成長をサポートしています。",
      "url": siteUrl,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "03-1234-5678",
        "contactType": "customer service",
        "email": "info@selflove.laboratory.com"
      },
      "sameAs": [siteUrl]
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "読み聞かせ会・情操教育プログラム",
      "description": "セルフラブ絵本「ビビアン」を使った読み聞かせ会と情操教育プログラムを提供しています。",
      "provider": {
        "@type": "Organization",
        "name": "@selflove.laboratory"
      },
      "serviceType": "Educational Service",
      "audience": {
        "@type": "Audience",
        "audienceType": "Children"
      },
      "areaServed": "Japan",
      "availableChannel": {
        "@type": "ServiceChannel",
        "serviceUrl": siteUrl,
        "serviceSmsNumber": "03-1234-5678"
      }
    };

    // 既存のschemaタグを削除
    document.querySelectorAll('script[type="application/ld+json"]').forEach(node => node.remove());

    // 新しいschemaタグを追加
    [schemaData, organizationSchema, serviceSchema].forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    //canonical URLを設定
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', siteUrl);
    }

    // Open Graph設定
    const ogProperties = [
      { property: 'og:url', content: siteUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'セルフラブ絵本ビビアン | あなたの虹はなあに？' },
      { property: 'og:description', content: '朗読とワークで「弱みを好きになれる」セルフラブの物語。子どもたちが自分らしさを大切にし、他者を尊敬する心を育む絵本です。朗読ワークのご依頼も承ります。' },
      { property: 'og:image', content: 'https://static.readdy.ai/image/eaa52119033ac8864aa00eb190fc57f3/73cee288bc799de519e17daf49b813a4.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'セルフラブ絵本ビビアン - 朗読とワークで弱みを好きになれる物語' },
      { property: 'og:site_name', content: 'Self Love LAB.事務局' },
      { property: 'og:locale', content: 'ja_JP' }
    ];

    // Twitter Card設定
    const twitterProperties = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@selflove.laboratory' },
      { name: 'twitter:title', content: 'セルフラブ絵本ビビアン | あなたの虹はなあに？' },
      { name: 'twitter:description', content: '朗読とワークで「弱みを好きになれる」セルフラブの物語。子どもたちが自分らしさを大切にし、他者を尊敬する心を育む絵本です。' },
      { name: 'twitter:image', content: 'https://static.readdy.ai/image/eaa52119033ac8864aa00eb190fc57f3/73cee288bc799de519e17daf49b813a4.png' },
      { name: 'twitter:image:alt', content: 'セルフラブ絵本ビビアン - 朗読とワークで弱みを好きになれる物語' }
    ];

    // OGPメタタグを設定
    ogProperties.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Twitter Cardメタタグを設定
    twitterProperties.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  }, []);

  // Auto-play slider for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Auto-play slider for images with responsive calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageSlide((prev) => {
        // Calculate max slides based on screen size
        const getMaxSlides = () => {
          if (window.innerWidth >= 1024) {
            // lg: 3 columns, so max slide is total - 3 + 1
            return Math.max(0, sessionImages.length - 3);
          } else if (window.innerWidth >= 768) {
            // md: 2 columns, so max slide is total - 2 + 1
            return Math.max(0, sessionImages.length - 2);
          } else {
            // sm: 1 column, so max slide is total - 1
            return sessionImages.length - 1;
          }
        };

        const maxSlides = getMaxSlides();
        return prev >= maxSlides ? 0 : prev + 1;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Handle window resize to reset slider position if needed
  useEffect(() => {
    const handleResize = () => {
      const maxSlides = getMaxSlides();
      if (currentImageSlide > maxSlides) {
        setCurrentImageSlide(maxSlides);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [currentImageSlide]);

  const newsItems = [
    {
      date: "2025.10.02",
      content: (
        <>
          桜丘高校一年生の保健の授業で特別講義を実施しました。
          <a
            href="https://sakuragaoka.ac.jp/topics/38977"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 underline"
          >
            授業の様子
          </a>
        </>
      )
    },
    {
      date: "2025.10.01",
      content: (
        <>
          先生、教育関係者向けの資料を
          <a
            href="#footer"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-purple-600 hover:text-purple-800 underline"
          >
            ダウンロード
          </a>
          いただけるようになりました
        </>
      )
    },
    {
      date: "2025.09.30",
      content: "ウェブサイトを公開しました"
    }
  ];

  const programs = [
    {
      title: "子どもから大人まで",
      description: "誰もが自分の感情を大切にし、心を安心させながら、人とのつながりを深め、自分らしく生きる力を育んでいきます。",
      image: "A warm kindergarten classroom scene with children sitting in a circle listening to a story, soft natural lighting, rainbow decorations on walls, peaceful and nurturing atmosphere, teacher reading colorful book to engaged young students"
    },
    {
      title: "仲間と一緒に",
      description: "コミュニティや集まりの場で、お互いの違いを受け入れ、支え合う心が自然に育ちます。",
      image: "Elementary school classroom with diverse children engaged in discussion, teacher reading a colorful book, inclusive and supportive learning environment, students raising hands enthusiastically, educational posters on walls"
    },
    {
      title: "学校や学びの場で",
      description: "道徳や探究の時間に取り入れることで、自己理解・他者理解・自己肯定感、人間関係スキルが、ぐっと深まります。",
      image: "Elementary school classroom with diverse children engaged in discussion, teacher reading a colorful book, inclusive and supportive learning environment, students raising hands enthusiastically, educational posters on walls"
    },
    {
      title: "親子で楽しむ時間に",
      description: "朗読を通じて気持ちを分かち合い、親子の対話や心の成長をあたたかくサポートします。",
      image: "Cozy family reading time at home, parent and child cuddled together reading a rainbow-themed book, warm evening light, loving atmosphere, comfortable sofa with soft pillows and blankets"
    }
  ];

  const testimonials = [
    {
      name: "教師",
      role: "",
      comment: "虹のワークで、弱みの裏側にある魅力を見つけるために、視点や解釈が自然と広がっていくのを実感しました。教室の空気がやわらぎ、子ども同士の関わり方も変わってきています。",
      image: "🎓",
      isIcon: true
    },
    {
      name: "小学生",
      role: "",
      comment: "みんなの前で声に出すのはドキドキしたけど、すごく楽しかった！\"わかる！あなたの虹が素敵！\"って思えたし、自分らしさを褒めてもらえてうれしかったです。",
      image: "📚",
      isIcon: true
    },
    {
      name: "中高生",
      role: "",
      comment: "自分の気持ちや考えを人に言うのが苦手だったけど、ここでは安心できました。同じ場で友だちを応援できたことも、すごくうれしかったです。",
      image: "✨",
      isIcon: true
    },
    {
      name: "子育て中の親",
      role: "",
      comment: "子どもが\"弱いところも虹なんだよね\"と言ってくれて胸がいっぱいになりました。親としても\"そのままでいい\"と受けとめる自信につながりました。",
      image: "💝",
      isIcon: true
    },
    {
      name: "一般女性",
      role: "",
      comment: "自分の気持ちを声に出すだけで心がすっと軽くなりました。朗読を通して安心して人とつながれる感覚を味わえたのが、とても新鮮でした。",
      image: "🌈",
      isIcon: true
    },
    {
      name: "経営者",
      role: "",
      comment: "本音の声を引き出し合える、対話し合える、まさにこういう教育現場が欲しいと思っていました。このプログラムが様々な地域に広がってほしいと強く感じました。",
      image: "💼",
      isIcon: true
    }
  ];

  const sessionImages = [
    {
      src: "/assets/images/ws-10.jpg",
      alt: "朗読ワークの様子 10"
    },
    {
      src: "/assets/images/ws-12.jpg",
      alt: "朗読ワークの様子 12"
    },
    {
      src: "/assets/images/ws-11.jpg",
      alt: "朗読ワークの様子 11"
    },
    {
      src: "/assets/images/ws-13.jpg",
      alt: "朗読ワークの様子 13"
    },
    {
      src: "/assets/images/ws-09.jpg",
      alt: "朗読ワークの様子 9"
    },
    {
      src: "/assets/images/ws-08.jpg",
      alt: "朗読ワークの様子 8"
    },
    {
      src: "/assets/images/ws-07.jpg",
      alt: "朗読ワークの様子 7"
    },
    {
      src: "/assets/images/ws-06.jpg",
      alt: "朗読ワークの様子 6"
    },
    {
      src: "/assets/images/ws-05.jpg",
      alt: "朗読ワークの様子 5"
    },
    {
      src: "/assets/images/ws-04.jpg",
      alt: "朗読ワークの様子 4"
    },
    {
      src: "/assets/images/ws-03.jpg",
      alt: "朗読ワークの様子 3"
    },
    {
      src: "/assets/images/ws-02.jpg",
      alt: "朗読ワークの様子 2"
    },
    {
      src: "/assets/images/ws-01.jpg",
      alt: "朗読ワークの様子 1"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getMaxSlides = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        // lg: 3 columns - calculate how many complete sets of 3 can be shown
        return Math.ceil(sessionImages.length / 3) - 1;
      } else if (window.innerWidth >= 768) {
        // md: 2 columns - calculate how many complete sets of 2 can be shown
        return Math.ceil(sessionImages.length / 2) - 1;
      } else {
        // sm: 1 column
        return sessionImages.length - 1;
      }
    }
    return sessionImages.length - 1;
  };

  const nextImageSlide = () => {
    setCurrentImageSlide((prev) => {
      const maxSlides = getMaxSlides();
      return prev >= maxSlides ? 0 : prev + 1;
    });
  };

  const prevImageSlide = () => {
    setCurrentImageSlide((prev) => {
      const maxSlides = getMaxSlides();
      return prev <= 0 ? maxSlides : prev - 1;
    });
  };

  // Touch and mouse event handlers
  const handleStart = (clientX: number) => {
    touchStartX.current = clientX;
    touchEndX.current = 0;
  };

  const handleMove = (clientX: number) => {
    touchEndX.current = clientX;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.targetTouches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current !== 0) {
      handleMove(e.clientX);
    }
  };

  const handleTestimonialTouchEnd = () => {
    if (touchStartX.current === 0 || touchEndX.current === 0) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    console.log('Testimonial swipe:', { distance, isLeftSwipe, isRightSwipe });

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }

    // Reset touch positions
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleImageSlideTouchEnd = () => {
    if (touchStartX.current === 0 || touchEndX.current === 0) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    console.log('Image swipe:', { distance, isLeftSwipe, isRightSwipe });

    if (isLeftSwipe) {
      nextImageSlide();
    } else if (isRightSwipe) {
      prevImageSlide();
    }

    // Reset touch positions
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image Section - First on mobile, second on desktop */}
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative">
                <img
                  src="https://static.readdy.ai/image/eaa52119033ac8864aa00eb190fc57f3/73cee288bc799de519e17daf49b813a4.png"
                  alt="セルフラブ絵本ビビアン - あなたの虹はなあに？朗読とワークで弱みを好きになれる"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  ✨
                </div>
              </div>
            </div>

            {/* Text Section - Second on mobile, first on desktop */}
            <div className="lg:w-1/2 space-y-8 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-purple-600 font-medium shadow-lg">
                  <a
                    href="https://www.instagram.com/selflove.laboratory/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-800 transition-colors cursor-pointer flex items-center"
                  >
                    <i className="ri-instagram-fill mr-2"></i>
                    @selflove.laboratory
                  </a>
                </div>

                {/* Enhanced Title Section */}
                <div className="relative">
                  {/* Decorative Background Elements */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-blue-200/30 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>

                  <div className="relative space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                      {/* First Line - Decorative Style */}
                      <span className="block relative">
                        <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 blur-sm opacity-70">
                          セルフラブ絵本
                        </span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 drop-shadow-lg">
                          セルフラブ絵本
                        </span>
                      </span>

                      {/* Second Line - Main Title with Rainbow Effect */}
                      <span className="block relative mt-2">
                        <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-pink-500 blur-md opacity-50">
                          ビビアン
                        </span>
                        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-pink-500 animate-[gradient_3s_ease-in-out_infinite]">
                          ビビアン
                        </span>
                        {/* Sparkle Effects */}
                        <span className="absolute -top-2 -right-2 text-3xl animate-pulse">✨</span>
                        <span className="absolute -bottom-2 -left-2 text-2xl animate-pulse">🌈</span>
                      </span>
                    </h1>

                    {/* Subtitle with Enhanced Style */}
                    <div className="relative mt-6 inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-2xl blur-md opacity-40"></div>
                      <p className="relative text-2xl lg:text-3xl font-bold bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        あなたの虹はなあに？
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed pt-2">
                  朗読とワークで「弱みを好きになれる」セルフラブの物語。<br />
                  子どもたちが自分らしさを大切にし、他者を尊敬する心を育む絵本です。
                </p>
              </div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 relative z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('朗読ワークボタンがクリックされました');
                    const contactForm = document.getElementById('contact-form');
                    if (contactForm) {
                      contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      console.log('contact-formが見つかりません');
                    }
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  朗読ワークのご依頼
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('活用プログラムボタンがクリックされました');
                    const programsSection = document.getElementById('programs');
                    if (programsSection) {
                      programsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      console.log('programsセクションが見つかりません');
                    }
                  }}
                  className="bg-white/90 backdrop-blur-sm border-2 border-purple-400 text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-500 hover:text-white hover:border-purple-500 hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
                >
                  活用プログラム
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('絵本の購入ボタンがクリックされました');

                    // より確実な方法でセクションを見つける
                    const sections = document.querySelectorAll('section');
                    let purchaseSection = null;

                    // セクション内のテキストを検索
                    for (const section of sections) {
                      if (section.textContent && section.textContent.includes('絵本の購入はこちら')) {
                        purchaseSection = section;
                        break;
                      }
                    }

                    // 画像のalt属性からも検索
                    if (!purchaseSection) {
                      const purchaseImage = document.querySelector('img[alt*="絵本ビビアン - 購入ページ"]');
                      if (purchaseImage) {
                        purchaseSection = purchaseImage.closest('section');
                      }
                    }

                    if (purchaseSection) {
                      purchaseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      console.log('購入セクションが見つかりません');
                      window.open('https://selflovelab.base.shop/items/87374284', '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer relative z-30"
                  style={{ pointerEvents: 'auto' }}
                >
                  絵本の購入
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2 flex items-center justify-center">
                <i className="ri-newspaper-line text-purple-500 mr-2"></i>
                お知らせ
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(showAllNews ? newsItems : newsItems.slice(0, 2)).map((news, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500 font-medium">{news.date}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {news.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {newsItems.length > 2 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllNews(!showAllNews)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center justify-center mx-auto transition-colors duration-300"
                >
                  {showAllNews ? (
                    <>
                      <span>閉じる</span>
                      <i className="ri-arrow-up-s-line ml-1"></i>
                    </>
                  ) : (
                    <>
                      <span>もっとみる</span>
                      <i className="ri-arrow-down-s-line ml-1"></i>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block px-6">
              絵本について
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              「ビビアン」は、自分の弱みを受け入れることから始まる成長の物語です。<br />
              主人公と一緒に、自分だけの「虹」を見つけていきます。
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-user-heart-fill text-3xl text-pink-500"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">自己理解・自己肯定感</h3>
                <p className="text-gray-600 leading-relaxed">
                  内面を見つめ、ありのままの自分を受け入れる力、自分らしさを大切にする心を育みます。
                </p>
              </div>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-group-fill text-3xl text-green-500"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">共感力・コミュニケーション</h3>
                <p className="text-gray-600 leading-relaxed">
                  相手の気持ちに寄り添い、自分の感情を言葉で表現する力、対話力を身につけます。
                </p>
              </div>
            </div>
            <div className="text-center space-y-6 md:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-rainbow-fill text-3xl text-yellow-500"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">多様性の尊重</h3>
                <p className="text-gray-600 leading-relaxed">
                  「みんな違ってみんな良い」。個性を大切にし、自他の違いを活かし合う心を育みます。
                </p>
              </div>
            </div>
          </div>

          {/* Characters Section */}
          <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-4 relative inline-block px-6">
                登場人物紹介
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-pink-400 rounded-full"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-400 rounded-full"></div>
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto text-left">
                物語には個性豊かなキャラクターたちが登場します。それぞれの「虹」を持つ仲間たちと一緒に、成長の旅を体験してください。
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl shadow-xl p-6 md:p-8 mx-auto">
              <img
                src="/assets/images/vivian_characters.jpg"
                alt="ビビアンの登場人物たち - それぞれの個性と虹を持つキャラクター"
                className="w-full rounded-2xl shadow-lg md:cursor-pointer md:hover:opacity-90 transition-opacity duration-300"
                onClick={(e) => {
                  // Desktop only: open modal
                  if (window.innerWidth >= 768) {
                    setShowCharacterModal(true);
                  }
                }}
              />
              <p className="hidden md:block text-center text-sm text-gray-500 mt-4">
                クリックで拡大表示
              </p>
            </div>
          </div>

          {/* Character Modal - Desktop only */}
          {showCharacterModal && (
            <div
              className="hidden md:flex fixed inset-0 bg-black/80 z-50 items-center justify-center p-4"
              onClick={() => setShowCharacterModal(false)}
            >
              <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <button
                  onClick={() => setShowCharacterModal(false)}
                  className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300 transition-colors z-10"
                >
                  <i className="ri-close-line"></i>
                </button>
                <img
                  src="/assets/images/vivian_characters.jpg"
                  alt="ビビアンの登場人物たち - それぞれの個性と虹を持つキャラクター"
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block px-6">
              朗読×セルフラブ 体感ワーク・プログラム
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              「声に出し、気持ちを味わいながら、弱みを"虹"に変える学びの時間」
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {programs.map((program, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${selectedProgram === index ? 'bg-white shadow-xl border-2 border-purple-200' : 'bg-white/70 hover:bg-white hover:shadow-lg'}`}
                  onClick={() => setSelectedProgram(index)}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative">
              <img
                src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28programs%5BselectedProgram%5D.image%29%7D&width=600&height=400&seq=program-${selectedProgram}&orientation=landscape`}
                alt={programs[selectedProgram].title}
                className="w-full rounded-2xl shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Now with Slider */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block px-6">
              朗読ワークの事例
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              実際に『ビビアン』の朗読ワークを体験された方々の声をご紹介します。子どもから大人まで、それぞれの立場でこんな気づきや変化がありました。
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div
              ref={testimonialRef}
              className="relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTestimonialTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleTestimonialTouchEnd}
              onMouseLeave={handleTestimonialTouchEnd}
              style={{ touchAction: 'none' }}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg mx-auto max-w-2xl">
                      <div className="flex items-center mb-6">
                        {testimonial.isIcon ? (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mr-4">
                            <span className="text-2xl">{testimonial.image}</span>
                          </div>
                        ) : (
                          <img
                            src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28testimonial.image%29%7D&width=80&height=80&seq=testimonial-${index}&orientation=squarish`}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed italic text-lg mb-6">
                        「{testimonial.comment}」
                      </p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="ri-star-fill"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors duration-300 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-2xl text-gray-600"></i>
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer ${
                      currentTestimonial === index ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors duration-300 cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-2xl text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Session Images - Now with Slider */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block px-6">
              朗読ワークの様子
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              温かい雰囲気の中で、子どもたちと一緒に心の成長を育んでいます
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div
              ref={imageSlideRef}
              className="relative overflow-hidden rounded-2xl select-none cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleImageSlideTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleImageSlideTouchEnd}
              onMouseLeave={handleImageSlideTouchEnd}
              style={{ touchAction: 'none' }}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: (() => {
                    if (typeof window !== 'undefined') {
                      if (window.innerWidth >= 1024) {
                        // lg: 3 columns, move by 100% (3 images at a time)
                        return `translateX(-${currentImageSlide * 100}%)`;
                      } else if (window.innerWidth >= 768) {
                        // md: 2 columns, move by 100% (2 images at a time)
                        return `translateX(-${currentImageSlide * 100}%)`;
                      } else {
                        // sm: 1 column, move by 100% (1 image at a time)
                        return `translateX(-${currentImageSlide * 100}%)`;
                      }
                    }
                    return `translateX(-${currentImageSlide * 100}%)`;
                  })()
                }}
              >
                {sessionImages.map((image, index) => (
                  <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                    <div className="relative group">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-60 md:h-72 lg:h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <button
                onClick={prevImageSlide}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors duration-300 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-2xl text-gray-600"></i>
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: getMaxSlides() + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer ${
                      currentImageSlide === index ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextImageSlide}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-purple-50 transition-colors duration-300 cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-2xl text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6 relative inline-block px-6">
              朗読ワーク動画
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-400 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto text-left">
              実際の朗読ワークの様子をご覧いただけます
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-xl"
                    src="https://www.youtube.com/embed/Bt4X-wUuuBE"
                    title="朗読ワーク実践編"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-xl"
                    src="https://www.youtube.com/embed/gbJQOxnjv3w"
                    title="ワークショップの様子"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-form" className="py-20 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block px-6">
                朗読ワークのご依頼
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-full"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto text-left">
                学校・園・地域・コミュニティ、企業イベントや親子の集まりなど、さまざまな場面で開催いただけます。<br />
                朗読と体感ワークを通じて、"心を育む特別な時間"を一緒に届けませんか？
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">こんな場所でご活用いただけます</h3>
                  <ul className="space-y-3">
                    {[
                      "小学校・中学校・高校",
                      "道徳・総合・探究学習などに",
                      "学童・フリースクール",
                      "放課後や居場所づくりのプログラムに",
                      "地域コミュニティ・イベント",
                      "世代を超えた交流や文化活動に",
                      "コミュニケーション研修・対話ワークショップ",
                      "社会人や団体向けの人間関係づくりに"
                    ].map((place, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <i className="ri-check-line text-green-500 mr-3 mt-1 flex-shrink-0"></i>
                        <span>{place}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">プログラムの流れ</h3>
                  <p className="text-gray-600 mb-4 text-sm">「絵本の朗読」と「虹ワーク」の2部構成です。</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">絵本の朗読（30分）</h4>
                      <p className="text-sm text-gray-600 mb-2">スライド映像と音楽に合わせて物語の世界へ。</p>
                      <p className="text-sm text-gray-600">ただ聴くだけでなく、登場人物を演じ"声"で表現することで、想像力と感性を育みます。</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">虹のワーク（30〜60分）</h4>
                      <p className="text-sm text-gray-600 mb-2">対話や体験を通して、</p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>- 自己理解・自己肯定感</li>
                        <li>- 共感力・コミュニケーション</li>
                        <li>- 多様性の尊重</li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-2">を自然に育みます。</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg">
                          <h5 className="font-semibold text-gray-800 text-sm">⭐️ 一番人気プラン</h5>
                          <p className="text-sm text-gray-600">①朗読 ＋ ②虹ワーク（40〜90分）</p>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-semibold text-gray-800 text-sm">⭐️ お試しプラン</h5>
                          <p className="text-sm text-gray-600">①朗読のみ（30分）</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-file-text-fill text-3xl text-white"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    お申し込みフォーム
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-left">
                    朗読ワークのご依頼やご質問は、こちらからお気軽にどうぞ。<br />
                    小規模の会や試験的な開催も大歓迎です。まずはご相談ください。
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Google Form button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('https://docs.google.com/forms/d/e/1FAIpQLSeE_qzlNXSQOW36DWviuqcHwjnhdOqWkXfbKk72bH9qT8oNAg/viewform', '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="ri-external-link-fill mr-3"></i>
                    朗読ワークに申し込む
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    ※ 新しいタブでGoogleフォームが開きます
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Book Purchase Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="text-center lg:text-left space-y-8">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 relative inline-block px-6">
                      絵本の購入はこちら
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-yellow-300 rounded-full"></div>
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-purple-400 rounded-full"></div>
                    </h2>
                    <p className="text-xl text-gray-200 leading-relaxed mb-8 text-left">
                      ご家庭でも「ビビアン」の物語をお楽しみいただけます。<br />
                      お子様との特別な読み聞かせ時間を作りませんか？
                    </p>
                  </div>
                  <div className="flex justify-center lg:justify-start">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open('https://selflovelab.base.shop/items/87374284', '_blank', 'noopener,noreferrer');
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                      <i className="ri-shopping-cart-fill mr-3"></i>
                      購入する
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-full blur-2xl"></div>
                  <img
                    src="https://static.readdy.ai/image/eaa52119033ac8864aa00eb190fc57f3/d33963635a7dcde0f681569d0439a989.png"
                    alt="絵本ビビアン - 購入ページ"
                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-40 rounded-full flex items-center justify-center text-2xl animate-pulse">
                    📚
                  </div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                    🎁
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 relative inline-block px-6">
              Blog
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-400 rounded-full"></div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-400 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              ビビアン朗読ワークやセルフラブ、SEL教育について発信しています
            </p>
          </div>

          {loadingBlog ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {blogPosts.map((post, index) => (
                <a
                  key={index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // 画像が読み込めない場合はStable Diffusion生成画像を使用
                        const target = e.target as HTMLImageElement;
                        target.src = `https://readdy.ai/api/search-image?query=${encodeURIComponent('Beautiful childrens book illustration, soft pastel colors, rainbow theme, educational and heartwarming')}&width=400&height=300&seq=blog-${index}&orientation=landscape`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-purple-600 font-medium mb-2">
                      {post.pubDate}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center text-purple-600 font-medium group-hover:text-purple-800 transition-colors duration-300">
                      続きを読む
                      <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="https://note.com/ran_ishihara"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <i className="ri-article-line mr-3"></i>
              ブログ一覧を見る
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Self Love LAB.事務局
              </h3>
              <p className="text-gray-300 leading-relaxed">
                SEL教材開発・教員研修・教育支援を行う民間団体。<br />
                子どもたちの心の成長をサポートする絵本「ビビアン」を通じて、セルフラブの大切さを伝えています。
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/selflove.laboratory/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                >
                  <i className="ri-instagram-fill text-white"></i>
                </a>
                <a
                  href="https://www.youtube.com/@selflovelaboratory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                >
                  <i className="ri-youtube-fill text-white"></i>
                </a>
              </div>
            </div>

            {/* Download and Contact Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">資料ダウンロード</h4>
                <div className="space-y-3">
                  <a
                    href="/pdf/education_flyer.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-purple-300 transition-colors"
                  >
                    <i className="ri-file-pdf-fill text-red-400 mr-3"></i>
                    先生向けご案内チラシ（PDF）
                  </a>
                  <a
                    href="/pdf/rainbow-project-for-educators-2025.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-purple-300 transition-colors"
                  >
                    <i className="ri-file-pdf-fill text-red-400 mr-3"></i>
                    教育関係者向けビビアン活動説明資料（PDF）
                  </a>
                  <a
                    href="/pdf/vivian_characters.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-300 hover:text-purple-300 transition-colors"
                  >
                    <i className="ri-file-pdf-fill text-red-400 mr-3"></i>
                    朗読ワーク資料 vivian登場人物（PDF）
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">お問い合わせ</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <i className="ri-mail-fill text-blue-400 mr-3"></i>
                    <a href="mailto:mahounogakuen.21@gmail.com" className="hover:text-purple-300 transition-colors">mahounogakuen.21@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © 2024 Self Love LAB.事務局. All rights reserved.
              </div>
              <div className="text-gray-400 text-sm">
                運営：<a href="https://mahounogakuen.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">合同会社 魔法の学園</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
