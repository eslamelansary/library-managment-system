export function ApiResponse(
  message: string = '',
  data: any = {},
  statusCode: number = 200,
) {
  return {
    message,
    data: { ...data },
    statusCode,
  };
}
