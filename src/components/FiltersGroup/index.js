import {IoIosSearch} from 'react-icons/io'
import './index.css'

const FiltersGroup = props => {
  const {searchInput} = props

  const onchangeSearchInut = event => {
    searchInput(event.target.value)
  }

  const renderCategoryList = () => {
    const {categoryOptions} = props

    return categoryOptions.map(eachItem => {
      const {getCategoryItem, activeCategoryId} = props

      const onClickCategory = () => {
        getCategoryItem(eachItem.categoryId)
      }

      const categoryItem =
        activeCategoryId === eachItem.categoryId ? 'categoryActive' : ''
      return (
        <li key={eachItem.categoryId}>
          <button
            className={`categoryBtn ${categoryItem}`}
            type="button"
            onClick={onClickCategory}
          >
            {eachItem.name}
          </button>
        </li>
      )
    })
  }

  const renderRating = () => {
    const {ratingsList, getRatingProducts, rating} = props

    return ratingsList.map(eachItem => {
      const id = eachItem.ratingId
      const imgUrl = eachItem.imageUrl
      const onclickRating = () => {
        getRatingProducts(id)
      }

      const activeRatingId =
        rating === eachItem.ratingId ? 'categoryActive' : ''

      return (
        <li className="ratingItem" key={eachItem.ratingId}>
          <button type="button" className="ratingBtn" onClick={onclickRating}>
            <img src={imgUrl} className="rating" alt="rating" />
          </button>
          <p className={activeRatingId}>& up</p>
        </li>
      )
    })
  }

  return (
    <div className="filters-group-container">
      <div className="searchInputBg">
        <input
          type="text"
          placeholder="Search"
          className="searchInput"
          onChange={onchangeSearchInut}
        />
        <IoIosSearch />
      </div>
      <h2>Category</h2>

      <ul className="categoryBg">{renderCategoryList()}</ul>
      {/* Replace this element with your code */}
      <h2>Rating</h2>
      <ul className="categoryBg">{renderRating()}</ul>
    </div>
  )
}

export default FiltersGroup
