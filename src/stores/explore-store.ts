import {defineStore} from 'pinia'
import {get_explore_tags} from 'src/apis/explore'
import { get_explores } from 'src/apis/explore';
import { MetaData } from 'src/models/responseModel';
import {ref} from 'vue'
interface exploreListType{
   id: string;
   name: string;
   image: string;
   default_color: string;
   description: string;
   is_premium: boolean;
   creator_uuid: string;
   created_at: string;
   created_by: string;
   type: 'Persona' | 'Tool';
   is_preferable_entity: boolean;
   total_messages: number;
 };
export const useExplore =defineStore('exploreStore',()=>{
    const explore_tags = ref<{title:string, description:string}[]>([])
    const explore_list = ref<exploreListType[]>([])
    const selected_tag = ref<string>('Recommended')
    const meta_data = ref<MetaData>({
      total: 0,
      offset: 0,
      limit: 5,
      returned: 0
    })

   const get_explore_lists = async()=>{
    await get_explores(selected_tag.value, meta_data.value.limit, meta_data.value.offset)
    .then((response) => {
       explore_list.value = response.data?.data
       meta_data.value = response.data?.meta_data
    })
    .catch((error) => {
      console.log(error);
    });

   }

    const paginateExplores =async()=>{
      meta_data.value.offset = meta_data.value.offset + meta_data.value.limit
      await get_explores(selected_tag.value, meta_data.value.limit, meta_data.value.offset)
      .then((response) => {
         response.data?.data.forEach((explore:any )=> {
            explore_list.value.push(explore)
         });
         meta_data.value = response.data?.meta_data
      })
      .catch((error) => {
        console.log(error);
      });
    }
     return {
        explore_tags,
        explore_list,
        selected_tag,
        meta_data,
        paginateExplores,
        get_explore_lists,
     }
});
