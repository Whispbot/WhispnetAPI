type TryCatchSuccess<T> = [data: T, error: null];

type TryCatchError<E> = [data: null, error: E];

type TryCatchReturn<T, E> = TryCatchSuccess<T> | TryCatchError<E>;

export const tryCatch = async <T, E>(
  promise: Promise<T>
): Promise<TryCatchReturn<T, E>> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as E];
  }
};
