// import { defineStore } from 'pinia';

export const useCoreStore = defineStore('CoreStore', {
    state: () => {
        return {
            showMenu: false,
            menues: {},
            settings: {},
            meta: {},
            currentPage: {},
            buildNumber: 0,
            headerTextColor: 'white'
        }
    },
    getters: {
        getShowMenu(state) {
            return state.showMenu;
        },
        getMenu: (state) => (menuSlug, lang) => {
            // Construct full slug with language if not provided
            const fullSlug = menuSlug.includes('-da') || menuSlug.includes('-en') 
                ? menuSlug 
                : `${menuSlug}-${lang}`;
            
            if (lang && state.menues[lang] && state.menues[lang][fullSlug]) {
                return state.menues[lang][fullSlug];
            }
            return state.menues[fullSlug] || [];
        },
        getCurrentPage(state) {
            return state.currentPage;
        },
        getPreviewContent(state) {
            return state.currentPage?.preview_acf.content;
        },
        getContent(state) {
            return state.currentPage.acf.content;
        },
        getSettings(state) {
            return state.settings;
        },
        getHeaderTextColor(state) {
            return state.headerTextColor;
        },
        getFavicon: (state) => () => {
            return state.settings?.logos?.favicon || null;
        },
    },
    actions: {
        setHeaderTextColor(color){
            this.headerTextColor = color;
        },
        setCurrentPage(pageData){
            this.currentPage = pageData;
        },
        setMeta(metaData){
            this.meta = metaData;
        },
        toggleShowMenu() {
            this.showMenu = !this.showMenu;
            if(this.showMenu){
                document.body.classList.add('overflow-hidden');
            } else {
                document.body.classList.remove('overflow-hidden');
            }
        },
        /**
         * Fetches project initialization data.
         * @returns {Promise<void>}
         */
        async fetchProjectInitData() {
            const { data, pending, error, refresh } = await useFetch('/api/init/', {
                query: {}
            });

            // IF success
            if (data) {
                // Sets settings.
                this.settings = data.value.data;
            }
        },
        async fetchMenus(language = 'da'){
            const { data, pending, error, refresh } = await useFetch('/api/menus/', {
                query: {
                    language: language,
                }
            });

            // IF success
            if (data && data.value && data.value.data) {
                // Store menus by language
                if (!this.menues[language]) {
                    this.menues[language] = {};
                }
                
                // Store each menu by its slug
                Object.entries(data.value.data).forEach(([menuSlug, menuItems]) => {
                    this.menues[language][menuSlug] = menuItems;
                });
            }
        }
    }
});
