import { defineStore } from "pinia";
import { GET_CATEGORIES } from "../graphql/queries/categories";

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
        loading: false,
        error: null
    }),

    getters: {
        getCategoriesById: (state) => (id) => {
            return state.categories.find(cat => cat.id === id)
        },
        categoryTree: (state) => {
            const buildTree = (items, parentId = null) => {
                return items.filter(item => item.parent_id === parentId).map(item => ({
                    ...item,
                    children: buildTree(items, item.id)
                }))
            }
            return buildTree(state.categories)
        }
    },

    actions: {
        async fetchCategories() {
            this.loading = true
            try {
                const { data } = await client.query(GET_CATEGORIES).toPromise()
                this.categories = data.categories
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        },

        async addCategory({ name, parentId }) {
            try {
                const { data } = await client.mutation()
            } catch (error) {

            }
        }
    }

})