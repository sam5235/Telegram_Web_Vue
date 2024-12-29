import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchInput =defineStore('search-store', ()=>{
    const searchInput  =ref<string>("")
    return {searchInput}
})

