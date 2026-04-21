import comments, { index } from "@/routes/posts/comments";
import { useQuery } from "@tanstack/react-query";
import axios from "axios"

const useComment = (postId: number) => {
    return useQuery({
        queryKey: ['comments'],
        queryFn: async () => {
            const res = await axios.get(index.url(postId), {
                headers: { Accept: 'application/json' },
            }) ;
            return res.data;
        }
    })
}

export default useComment;
