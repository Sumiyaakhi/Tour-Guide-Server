import QueryBuilder from "../../builder/QueryBuilder";
import { UserSearchableFields } from "../user/user.constant";
import { User } from "../user/user.model";

export const SearchPostByUserQueryMaker = async (
  query: Record<string, unknown>
) => {
  if (query?.searchTerm) {
    const userQuery = new QueryBuilder(User.find(), query).search(
      UserSearchableFields
    );

    const users = await userQuery.modelQuery;

    if (users && users.length > 0) {
      const userIds = users.map((user) => user._id);

      query["user"] = { $in: userIds };
      /**
       * query['user'] = {
       * $in: [
       * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
       * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
       * ]
       */
      delete query.searchTerm;
      return query;
    }
  }
  return query;
};

export const SearchPostByDateRangeQueryMaker = async (
  query: Record<string, unknown>
) => {
  if (query?.from || query?.to) {
    const dateQuery: Record<string, unknown> = {};

    if (query.from) {
      dateQuery["$gte"] = new Date(query.from as string);
    }

    if (query.to) {
      dateQuery["$lte"] = new Date(query.to as string);
    }

    if (Object.keys(dateQuery).length > 0) {
      query["createdAt"] = dateQuery; // Updated for posts to use 'createdAt' instead of 'dateFound'
    }

    delete query.from;
    delete query.to;
    return query;
  }
  return query;
};
