import { useState, type FormEvent } from 'react'
import { Bike, ChefHat, Clock3, MapPin, Star, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import SkipLink from '../../Components/SkipLink'
import usePageMeta from '../../hooks/usePageMeta'

const demoRestaurants = [
  {
    name: 'Naija Bowl',
    cuisine: 'Nigerian · Rice & bowls',
    categories: ['Nigerian'],
    image: '/images/naija-bowl-900.jpg',
    imageSmall: '/images/naija-bowl-400.jpg',
    alt: 'Colourful rice bowl with vegetables',
    rating: '4.8',
    deliveryTime: '25–35 min',
    deliveryFee: '₦800 delivery',
  },
  {
    name: 'The Grill Spot',
    cuisine: 'Grills · Nigerian',
    categories: ['Nigerian', 'Grills'],
    image: '/images/grill-spot-900.jpg',
    imageSmall: '/images/grill-spot-400.jpg',
    alt: 'Freshly grilled meat served with sides',
    rating: '4.7',
    deliveryTime: '30–40 min',
    deliveryFee: '₦1,000 delivery',
  },
  {
    name: 'Burger Yard',
    cuisine: 'Burgers · Quick bites',
    categories: ['Burgers', 'Grills'],
    image: '/images/burger-yard-900.jpg',
    imageSmall: '/images/burger-yard-400.jpg',
    alt: 'Stacked burger with lettuce and tomato',
    rating: '4.9',
    deliveryTime: '20–30 min',
    deliveryFee: '₦700 delivery',
  },
  {
    name: 'Oven & Co.',
    cuisine: 'Pizza · Italian',
    categories: ['Pizza'],
    image: '/images/oven-co-900.jpg',
    imageSmall: '/images/oven-co-400.jpg',
    alt: 'Fresh pizza topped with vegetables',
    rating: '4.6',
    deliveryTime: '30–45 min',
    deliveryFee: '₦900 delivery',
  },
  {
    name: 'Sweet Crumb',
    cuisine: 'Desserts · Bakery',
    categories: ['Desserts'],
    image: '/images/sweet-crumb-900.jpg',
    imageSmall: '/images/sweet-crumb-400.jpg',
    alt: 'Dessert topped with fresh berries',
    rating: '4.8',
    deliveryTime: '25–35 min',
    deliveryFee: '₦700 delivery',
  },
  {
    name: 'Mama T’s Kitchen',
    cuisine: 'Nigerian · Swallows & soups',
    categories: ['Nigerian'],
    image: '/images/mamas-kitchen-900.jpg',
    imageSmall: '/images/mamas-kitchen-400.jpg',
    alt: 'Hearty bowl of soup with fresh herbs',
    rating: '4.9',
    deliveryTime: '35–45 min',
    deliveryFee: '₦850 delivery',
  },
]

const Homepage = () => {
  const [searchMessage, setSearchMessage] = useState('')
  usePageMeta(
    'ChowZilla — Big cravings, small wait.',
    'Your favourite meals, made fresh and delivered fast. Find restaurants near you with ChowZilla.',
  )

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchMessage('Live ordering isn’t connected yet — scroll on to explore a few kitchens.')
    window.requestAnimationFrame(() => {
      document.getElementById('featured-restaurants')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="landing-page">
      <SkipLink />
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="order">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> GOOD FOOD, GOOD MOOD</div>
            <h1>Big cravings.<br /><span>Small wait.</span></h1>
            <p className="hero-description">
              Your favourite meals, made fresh and delivered fast. Find something delicious near you.
            </p>

            <form className="address-form" onSubmit={handleSearch}>
              <label className="address-input">
                <MapPin size={20} aria-hidden="true" />
                <span className="sr-only">Delivery address</span>
                <input type="text" name="address" autoComplete="street-address" placeholder="Delivery address" aria-describedby="search-hint" required />
              </label>
              <button type="submit">Find food</button>
            </form>

            <div className={`hero-note${searchMessage ? ' is-feedback' : ''}`} id="search-hint" role="status" aria-live="polite">
              <MapPin size={15} aria-hidden="true" />
              <span>{searchMessage || 'We’ll show kitchens that deliver to your area.'}</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="A freshly prepared meal ready for delivery">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="food-photo-wrap">
              <img
                className="food-photo"
                src="/images/hero-bowl-1000.jpg"
                srcSet="/images/hero-bowl-600.jpg 600w, /images/hero-bowl-1000.jpg 1000w"
                sizes="(max-width: 640px) 70vw, 390px"
                alt="Fresh colourful bowl with vegetables and grains"
                fetchPriority="high"
                decoding="async"
              />
              <span className="photo-label"><span /> Freshly made</span>
            </div>
            <div className="delivery-card">
              <span className="delivery-icon"><Clock3 size={19} /></span>
              <span><strong>Stay in the loop</strong><small>Follow your order updates</small></span>
              <span className="delivery-check" aria-hidden="true">✓</span>
            </div>
            <div className="floating-sticker">Made with<br /><b>love & spice</b> <span>✳</span></div>
          </div>
        </section>

        <div className="hero-bottom" id="partners">
          <span>Good food from the places you love</span>
          <div className="cuisine-list"><span>Local favourites</span><i /> <span>Quick bites</span><i /> <span>Something sweet</span></div>
        </div>

        <section className="restaurants-section" id="featured-restaurants" aria-labelledby="restaurants-heading">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">GOOD FOOD STARTS HERE</span>
              <h2 id="restaurants-heading">Featured restaurants</h2>
              <p>Meet a few kitchens ready to make your next meal.</p>
            </div>
          </div>
          <div className="restaurant-grid">
            {demoRestaurants.map((restaurant) => (
              <article className="restaurant-card" key={restaurant.name}>
                <div className="restaurant-image-wrap">
                  <img
                    src={restaurant.image}
                    srcSet={`${restaurant.imageSmall} 400w, ${restaurant.image} 900w`}
                    sizes="(max-width: 640px) 40vw, (max-width: 900px) 45vw, 360px"
                    alt={restaurant.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="restaurant-photo-mark">{restaurant.categories[0]}</span>
                </div>
                <div className="restaurant-details">
                  <div className="restaurant-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="restaurant-rating"><Star size={14} fill="currentColor" /> {restaurant.rating}</span>
                  </div>
                  <p className="restaurant-cuisine">{restaurant.cuisine}</p>
                  <div className="restaurant-meta">
                    <span><Clock3 size={14} /> {restaurant.deliveryTime}</span>
                    <i />
                    <span><Bike size={14} /> {restaurant.deliveryFee}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works" aria-labelledby="how-heading">
          <div className="how-intro">
            <span className="section-kicker">GOOD FOOD IN A FEW STEPS</span>
            <h2 id="how-heading">How ordering works</h2>
            <p>From your first search to the first bite, we keep it simple.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number" aria-hidden="true">01</span>
              <span className="step-icon"><MapPin size={23} /></span>
              <h3>Set your location</h3>
              <p>Enter your delivery address to see restaurants serving your area.</p>
            </article>
            <article className="step-card">
              <span className="step-number" aria-hidden="true">02</span>
              <span className="step-icon"><Utensils size={23} /></span>
              <h3>Choose your meal</h3>
              <p>Browse menus, pick your favourites, and place your order.</p>
            </article>
            <article className="step-card">
              <span className="step-number" aria-hidden="true">03</span>
              <span className="step-icon"><Bike size={23} /></span>
              <h3>Track your delivery</h3>
              <p>Follow your order and get ready to enjoy it at your door.</p>
            </article>
          </div>
        </section>

        <section className="closing-cta" aria-labelledby="closing-cta-heading">
          <div className="closing-cta-copy">
            <span className="cta-sparkle" aria-hidden="true">✳</span>
            <p className="section-kicker">YOUR NEXT MEAL STARTS HERE</p>
            <h2 id="closing-cta-heading">Good food is just around the corner.</h2>
            <p>Tell us where you are and find a meal worth looking forward to.</p>
          </div>
          <a className="closing-cta-button" href="#order">Find food near me</a>
        </section>

        <section className="join-section" aria-labelledby="join-heading">
          <div className="join-intro">
            <span className="section-kicker">GOOD THINGS GROW TOGETHER</span>
            <h2 id="join-heading">Part of the ChowZilla story?</h2>
            <p>Whether you make great food or deliver it, there’s a place for you here.</p>
          </div>
          <div className="join-grid">
            <article className="join-card vendor-card" id="vendors">
              <span className="join-icon"><ChefHat size={23} /></span>
              <span className="join-label">FOR FOOD BUSINESSES</span>
              <h3>Bring your kitchen to ChowZilla.</h3>
              <p>Introduce your restaurant and menu to customers looking for their next meal.</p>
              <Link className="join-link" to="/vendors">Vendor information</Link>
            </article>
            <article className="join-card rider-card" id="riders">
              <span className="join-icon"><Bike size={23} /></span>
              <span className="join-label">FOR DELIVERY RIDERS</span>
              <h3>Deliver good food, your way.</h3>
              <p>Learn about riding with ChowZilla and bringing orders to customers.</p>
              <Link className="join-link" to="/riders">Rider information</Link>
            </article>
          </div>
        </section>

        <section className="faq-section" id="faqs" aria-labelledby="faq-heading">
          <div className="faq-intro">
            <span className="section-kicker">A FEW HELPFUL ANSWERS</span>
            <h2 id="faq-heading">Questions? We’ve got you.</h2>
            <p>Here are a few things to know before your first order.</p>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>How do I find restaurants that deliver to me?</summary>
              <p>Enter your delivery address at the top of the page to see restaurants available in your area.</p>
            </details>
            <details className="faq-item">
              <summary>How do I place an order?</summary>
              <p>Choose a restaurant, browse its menu, add what you’d like, then follow the checkout steps to place your order.</p>
            </details>
            <details className="faq-item">
              <summary>When will I see the delivery fee?</summary>
              <p>Your delivery fee and order total should be shown before you confirm your order.</p>
            </details>
            <details className="faq-item">
              <summary>How can my restaurant join ChowZilla?</summary>
              <p>Visit the <Link to="/vendors">Vendors page</Link> to learn about listing a restaurant on ChowZilla.</p>
            </details>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Homepage
