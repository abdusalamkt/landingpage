// app/out-products/graphql/queries.js
export const GET_OUR_PRODUCTS_PAGE = `
  query GetOurProductsPage {
    page(id: "our-products", idType: URI) {
      ourProducts {
        productSections {
          sectionTitle
          sectionDescription
          sectionDefaultBg {
            sourceUrl
          }
          knowMoreUrl
          sectionCategories {
            categoryName
            categoriesUrl
            categoryHoverImage {
              sourceUrl
            }
            categoryProducts {
              productName
              productHoverBg {
                sourceUrl
              }
              productsUrl
            }
          }
        }
      }
    }
  }
`;
