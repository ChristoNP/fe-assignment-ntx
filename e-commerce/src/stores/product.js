import { defineStore } from "pinia";
import { ADD_PRODUCT, DELETE_PRODUCT, GET_PRODUCTS, UPDATE_PRODUCT } from "../graphql/queries/products";

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        loading: false,
        error: null
    }),

    getters: {
        getProductsByCategory: (state) => (categoryId) => {
            return state.products.filter(product => product.category_id === categoryId)
        },

        calculateCategoryTotal: (state) => (categoryId, categories) => {
            const calculateTotal = (catId) => {
                let total = 0
                total += state.products.filter(product => product.category_id === catId).reduce((sum, p) => sum + Number(p.price), 0)
                const subcategories = categories.filter(c => c.parent_id === catId)
                subcategories.forEach(sub => {
                    total += calculateTotal(sub.id)
                })
                return total
            }
            return calculateTotal(categoryId)
        }
    },

    actions: {
        async fetchProducts() {
            this.loading = true
            try {
                const { data } = await client.query(GET_PRODUCTS).toPromise()
                this.products = data.products
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async addProduct({ name, price, categoryId }) {
            try {
                const { data } = await client.mutation(ADD_PRODUCT, {
                    name,
                    price: Number(price),
                    category_id: categoryId
                }).toPromise()
                this.products.push(data.insert_products_one)
            } catch (error) {
                this.error = error.message
            }
        },

        async updateProduct({ id, name, price }) {
            try {
              const {data} = await client.mutation(UPDATE_PRODUCT, {
                id,
                name,
                price: Number(price)
              }).toPromise()
                const index = this.products.findIndex(p => p.id === id)
                if (index !== -1) {
                    this.products[index] = data.update_products_by_pk
                }
            } catch (error) {
                this.error = error.message
            }
        },

        async deleteProduct(id) {
            try {
                await client.mutation(DELETE_PRODUCT, {id}).toPromise()
                this.products = this.products.filter(p => p.id !== id)
            } catch (error) {
                this.error = error.message
            }
        }
    }
})