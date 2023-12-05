import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  succes: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions.optionId,
    searchInputVal: '',
    category: '',
    rating: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getSearchInput = inputVal => {
    this.setState({searchInputVal: inputVal}, this.getProducts)
  }

  getCategoryItem = id => {
    this.setState({category: id}, this.getProducts)
  }

  getRatingProducts = id => {
    this.setState({rating: id}, this.getProducts)
  }

  renderApiFailure = () => (
    <div className="noProductsFoundBg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
      />
      <h2>Oops! Something Went Wrong</h2>
      <p className="noProductsFoundMsg">
        We are having some trouble in processing your request.
        <br />
        Please try again.
      </p>
    </div>
  )

  getProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, searchInputVal, category, rating} = this.state
    console.log(category)
    console.log(jwtToken)
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${searchInputVal}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      console.log(response)
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.succes,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderNoProducts = () => (
    <div className="noProductsFoundBg">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h2>No Products Found</h2>
      <p className="noProductsFoundMsg">
        We could not find any products. Try another filters.
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {productsList.length === 0 ? (
          this.renderNoProducts()
        ) : (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)

    switch (apiStatus) {
      case apiStatusConstants.succes:
        return this.renderProductsList()

      case apiStatusConstants.failure:
        return this.renderApiFailure()

      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  // TODO: Add failure view

  render() {
    const {category, rating} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          searchInput={this.getSearchInput}
          categoryOptions={categoryOptions}
          getCategoryItem={this.getCategoryItem}
          activeCategoryId={category}
          ratingsList={ratingsList}
          getRatingProducts={this.getRatingProducts}
          rating={rating}
        />

        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
