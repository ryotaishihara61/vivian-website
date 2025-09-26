
import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImageSlide, setCurrentImageSlide] = useState(0);

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

    // Open Graphのog:urlを設定
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlMeta);
    }
    ogUrlMeta.setAttribute('content', siteUrl);
  }, []);

  // Auto-play slider for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
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

  const programs = [
    {
      title: "幼稚園・保育園での活用",
      description: "集団生活の中で、自分らしさを大切にしながら友達との違いを受け入れる心を育みます",
      image: "A warm kindergarten classroom scene with children sitting in a circle listening to a story, soft natural lighting, rainbow decorations on walls, peaceful and nurturing atmosphere, teacher reading colorful book to engaged young students"
    },
    {
      title: "小学校での道徳教育",
      description: "道徳の時間に活用し、多様性の理解と自己肯定感の向上を図ります",
      image: "Elementary school classroom with diverse children engaged in discussion, teacher reading a colorful book, inclusive and supportive learning environment, students raising hands enthusiastically, educational posters on walls"
    },
    {
      title: "家庭での親子時間",
      description: "親子のコミュニケーションツールとして、お子様の心の成長をサポートします",
      image: "Cozy family reading time at home, parent and child cuddled together reading a rainbow-themed book, warm evening light, loving atmosphere, comfortable sofa with soft pillows and blankets"
    }
  ];

  const testimonials = [
    {
      name: "田中 美香さん",
      role: "小学校教諭",
      comment: "子どもたちが自分の「弱み」について話すようになり、クラス全体が温かい雰囲気になりました。",
      image: "Professional female teacher portrait with warm smile, classroom background with colorful educational materials, kind and nurturing expression, professional attire, inspiring educator"
    },
    {
      name: "佐藤 家族",
      role: "保護者",
      comment: "娘が「私の虹は優しさだよ」と言ってくれた時、成長を感じて涙が出ました。",
      image: "Happy family portrait with mother, father and young daughter, rainbow artwork visible in background, warm home environment, loving family bond, joyful expressions"
    },
    {
      name: "山田 孝子さん",
      role: "読み聞かせボランティア",
      comment: "読み聞かせ会では子どもたちの目がキラキラと輝いていて、素晴らしい反応でした。",
      image: "Community volunteer reading to a group of engaged children in a library setting, warm and inviting atmosphere, children sitting attentively, books and educational materials around"
    }
  ];

  const sessionImages = [
    {
      src: "/images/ws-01.jpg",
      alt: "朗読ワークの様子 1"
    },
    {
      src: "/images/ws-02.jpg",
      alt: "朗読ワークの様子 2"
    },
    {
      src: "/images/ws-03.jpg",
      alt: "朗読ワークの様子 3"
    },
    {
      src: "/images/ws-04.jpg",
      alt: "朗読ワークの様子 4"
    },
    {
      src: "/images/ws-05.jpg",
      alt: "朗読ワークの様子 5"
    },
    {
      src: "/images/ws-06.jpg",
      alt: "朗読ワークの様子 6"
    },
    {
      src: "/images/ws-07.jpg",
      alt: "朗読ワークの様子 7"
    },
    {
      src: "/images/ws-08.jpg",
      alt: "朗読ワークの様子 8"
    },
    {
      src: "/images/ws-09.jpg",
      alt: "朗読ワークの様子 9"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 py-20">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-purple-600 font-medium">
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
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  セルフラブ絵本<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                    ビビアン
                  </span>
                </h1>
                <p className="text-2xl text-gray-600 font-medium">
                  あなたの虹はなあに？
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
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
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
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
                  className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-600 hover:text-white transition-all duration-300 whitespace-nowrap cursor-pointer"
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
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer relative z-30"
                  style={{ pointerEvents: 'auto' }}
                >
                  絵本の購入
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
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
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              絵本について
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              「ビビアン」は、自分の弱みを受け入れることから始まる成長の物語です。<br />
              主人公と一緒に、子どもたちは自分だけの「虹」を見つけていきます。
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <i className="ri-user-heart-fill text-3xl text-pink-500"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">自己理解と自己肯定感</h3>
                <p className="text-gray-600 leading-relaxed">
                  内面を見つめ、ありのままの自分を受け入れる力を育みます。自分らしさを大切にする心を育てます。
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
                  相手の気持ちに寄り添い、自分の感情を言葉で表現する力を身につけます。
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
                  みんな違ってみんな良い。個性を大切にし、他者を尊敬する心を育みます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              情装教育プログラム
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              様々な場面でご活用いただける、心の成長を促すプログラムをご提案しています
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
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              朗読ワークの事例
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              実際にビビアンの朗読ワークを体験された方々の声をお聞きください
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg mx-auto max-w-2xl">
                      <div className="flex items-center mb-6">
                        <img
                          src={`https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28testimonial.image%29%7D&width=80&height=80&seq=testimonial-${index}&orientation=squarish`}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
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
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              朗読ワークの様子
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              温かい雰囲気の中で、子どもたちと一緒に心の成長を育んでいます
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
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
            <h2 className="text-4xl font-bold text-white mb-6">
              朗読ワーク動画
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
                    src="https://www.youtube.com/embed/Cc9UPSnsb4s"
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
                    src="https://www.youtube.com/embed/Cc9UPSnsb4s"
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
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                朗読ワークのご依頼
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto text-left">
                学校、幼稚園、地域コミュニティ、企業イベントなど、様々な場所で朗読ワークを開催いたします。<br />
                子どもたちの心の成長をサポートする特別な時間を一緒に作りませんか？
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">こんな場所でご活用いただけます</h3>
                  <ul className="space-y-3">
                    {[
                      "幼稚園・保育園",
                      "小学校・中学校",
                      "図書館・児童館",
                      "地域コミュニティセンター",
                      "企業の家族向けイベント",
                      "親子カフェ・書店"
                    ].map((place, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <i className="ri-check-line text-green-500 mr-3"></i>
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">プログラム内容</h3>
                  <ul className="space-y-3">
                    {[
                      "絵本の朗読（30分）",
                      "参加型ワークショップ（30分）",
                      "みんなで描く虹のアート（30分）"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <i className="ri-bookmark-fill text-purple-500 mr-3"></i>
                        {item}
                      </li>
                    ))}

                  </ul>
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
                    朗読ワークのご依頼やご質問は、<br />
                    Googleフォームからお気軽にお問い合わせください。
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
                    お申し込み
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
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                      絵本の購入はこちら
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

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">お問い合わせ</h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <i className="ri-mail-fill text-blue-400 mr-3"></i>
                  <span>mahounogakuen.21@gmail.com</span>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
