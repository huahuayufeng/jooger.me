import { GetterTree, ActionTree, MutationTree, ActionContext } from 'vuex'

export interface StateTree {}

export interface RootState {
    app: AppStateTree
}

export interface Getters<S, R> extends GetterTree<S, R> {}

export interface Mutations<S> extends MutationTree <S> {}

export interface Actions<S, R> extends ActionTree <S, R> {}

export interface ActionCtx<S, R> extends ActionContext <S, R> {}

export interface AppStateTree {
    mobileLayout: boolean
    history: {
        articles: string[]
        comments: string[]
    }
    setting: null | WebApi.SettingModule.Setting
    categoryList: WebApi.CategoryModule.Category[]
}

export interface ArticleStateTree {
    list: {
        fetching: boolean
        data: WebApi.ArticleModule.Article[]
        pageInfo: WebApi.PageInfo
    }
    detail: {
        fetching: boolean
        liking: boolean
        data: WebApi.ArticleModule.Article
    }
    hot: {
        fetching: boolean
        data: WebApi.ArticleModule.Article[]
    }
    archive: {
        fetching: boolean
        data: any[]
        count: number
    }
}
