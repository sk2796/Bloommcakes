import { useQuery } from '@tanstack/react-query'
import { CakeService } from '../api/cake.service'

export function useCakeDetail(slug: string) {
  return useQuery({
    queryKey: ['cake', slug],
    queryFn: () => CakeService.getCakeBySlug(slug),
    enabled: !!slug
  })
}
