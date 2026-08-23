import { useQuery } from '@tanstack/react-query'
import { CakeService } from '../api/cake.service'

export function useCakes() {
  return useQuery({
    queryKey: ['cakes'],
    queryFn: CakeService.getCakes,
    placeholderData: []
  })
}
