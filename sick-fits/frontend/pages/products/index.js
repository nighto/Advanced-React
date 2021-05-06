import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import Products from '../../components/Products';

export default function ProductPage() {
  const { query } = useRouter();
  const queryPage = parseInt(query.page, 10) || 1;
  return (
    <div>
      <Pagination page={queryPage} />
      <Products page={queryPage} />
      <Pagination page={queryPage} />
    </div>
  );
}
