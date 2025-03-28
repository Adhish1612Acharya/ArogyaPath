import Post from "@/types/posts.types";
interface FilterProps {
  setData: (data: Post[] ) => void;
  filters: any;
  isPost: boolean;
  setLoading: (value: boolean) => void;
}

export default FilterProps;
