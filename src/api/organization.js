import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/account/api/admin/org',
    method: 'get',
    params: data
  })
}
