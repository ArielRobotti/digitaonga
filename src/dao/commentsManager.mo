import SharedTypes "sharedTypes";
import List "mo:base/List";
import Array "mo:base/Array";
// import Nat64 "mo:base/Nat64";

module {

  public type Comment = SharedTypes.Comment; 

  func pushBack<T>(input : T, list : List.List<T>) : List.List<T> {
    switch list {
      case null {
        return ?(input, null);
      };
      case (?(head, tail)) {
        return ?(head, pushBack(input, tail));
      };
    };
  };

  public func push(list : List.List<Comment>, input : Comment, path : [Int]) : List.List<Comment> {
    if (path.size() == 0) {
      return pushBack<Comment>(input, list) // Condicion de salida de recursividad
    } else {
      var commentsResult = List.nil<Comment>();

      for (comment in List.toIter(List.reverse(list))) {
        if (comment.created_at == path[0]) {
          let subPath = Array.subArray<Int>(path, 1, path.size() - 1 : Nat);
          let subComments = push(comment.subComments, input, subPath); // Llamada recursiva
          commentsResult := List.push<Comment>({ comment with subComments }, commentsResult);
        } else {
          commentsResult := List.push<Comment>(comment, commentsResult);
        };
      };
      return commentsResult;
    };
  };

};
