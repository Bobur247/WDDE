const TemplateCategories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="templateCategories">
      <h3>Kategoriyalar</h3>
      <ul>
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <li
              key={cat.id}
              className={isActive ? 'active' : ''}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="categoryIcon">
                <Icon />
              </span>
              <span className="categoryName">{cat.name}</span>
              <span className="categoryCount">{cat.count}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TemplateCategories
