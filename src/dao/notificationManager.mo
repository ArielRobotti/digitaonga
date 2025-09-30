module {

  let reactions = [
    "👍", "👎", "👏", "🙏", "✊", "🙌", "❤️", "🤝", "💯", "⚖️", "📜", "😂", "😢", "🔥", "😍", "🤔", "😎", "🎉", "🤯", "😏",
    "🕊️", "🌍", "🫶", "😮", "👀", "😡", "📢", "🌱", "🧑‍🤝‍🧑", "🤗", "💬", "🕯️", "🏳️", "🤝🏽", "🤝", "🚀", "😭", "🤩", "💔", "🫶"
  ];

  public func getReactions() : [Text] {
    reactions
  };

  public type NotificationKind = {

    #ReactComment : { // Notificacion a usuarios especificos
      root : Int; // Elemento donde fue efectuado el comentario. Ej: Proposal Id
      path : [Int]; // Ruta hasta el comentario o subcomentario
      sender : Principal;
      senderName : Text;
      reaction : Nat8; // La reaccion se especifica con el indice del array reactions
      date: Int;
      read: Bool;
    };

    #ProposalEvent: { // Notificaion global
      #New: Int;
      #Close: Int;
      #Approved: Int;
      #Rejected: Int;
    } 
  };

  public type Notification = {
    id : Int;
    title : Text;
    kind : NotificationKind;
  };
};
